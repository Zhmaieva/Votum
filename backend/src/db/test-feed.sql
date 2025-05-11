WITH
    params AS (
        SELECT
            'e33751cb-b1cd-481e-86ed-0d493885e60b'::uuid AS user_id,
            20 AS limit_rows
    ),

-- Base polls: not seen, not own, may or may not be followed
    base_polls AS (
        SELECT
            p.id,
            p.question,
            p.ends_in,
            p.readable_id,
            u.username,
            up2.user_id,
            up2.image,
            up2.followers_number,
            CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
            CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
            CASE WHEN p.created_by = params.user_id THEN up2.bio ELSE '' END AS user_bio,
            p.feed_score AS effective_score,
            p.created_at
        FROM polls p
                 JOIN params ON TRUE
                 JOIN users u ON u.id = p.created_by
                 JOIN user_profiles up2 ON up2.user_id = u.id
                 LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = params.user_id
                 LEFT JOIN user_follows uf ON uf.user_follower_id = params.user_id AND uf.user_follow_id = u.id
        WHERE p.is_deleted = false
          AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
          AND p.created_by <> params.user_id
          AND NOT EXISTS (
            SELECT 1 FROM poll_views v
            WHERE v.poll_id = p.id AND v.user_id = params.user_id
        )
        LIMIT (SELECT limit_rows FROM params)
    ),

-- Followed user polls, same filters but double score
    followed_polls AS (
        SELECT
            p.id,
            p.question,
            p.ends_in,
            p.readable_id,
            u.username,
            up2.user_id,
            up2.image,
            up2.followers_number,
            CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
            TRUE AS is_following,
            CASE WHEN p.created_by = params.user_id THEN up2.bio ELSE '' END AS user_bio,
            p.feed_score * 2 AS effective_score,
            p.created_at
        FROM polls p
                 JOIN params ON TRUE
                 JOIN users u ON u.id = p.created_by
                 JOIN user_profiles up2 ON up2.user_id = u.id
                 LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = params.user_id
                 JOIN user_follows uf ON uf.user_follower_id = params.user_id AND uf.user_follow_id = u.id
        WHERE p.is_deleted = false
          AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
          AND p.created_by <> params.user_id
          AND NOT EXISTS (
            SELECT 1 FROM poll_views v
            WHERE v.poll_id = p.id AND v.user_id = params.user_id
        )
        LIMIT (SELECT limit_rows FROM params)
    ),

-- Merge and deduplicate
    combined AS (
        SELECT * FROM base_polls
        UNION ALL
        SELECT * FROM followed_polls
    ),

    ranked AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY id ORDER BY effective_score DESC) AS rank
        FROM combined
    )

-- Final selection
SELECT
    id,
    question,
    ends_in,
    readable_id,
    username,
    user_id,
    image,
    followers_number,
    is_liked,
    is_following,
    user_bio
FROM ranked
WHERE rank = 1
ORDER BY effective_score DESC, created_at DESC
LIMIT (SELECT limit_rows FROM params);



UPDATE polls
SET feed_score = (
    -- Age decay bonus: up to +3000 for new polls
    COALESCE(
            CASE
                WHEN EXTRACT(EPOCH FROM ((NOW() AT TIME ZONE 'UTC') - created_at)) / 3600 < 24
                    THEN 3000 - (EXTRACT(EPOCH FROM ((NOW() AT TIME ZONE 'UTC') - created_at)) / 3600) * 80
                ELSE 0
                END, 0
    )
        +
        -- Ending soon bonus: +100 if < 1h left
    CASE
        WHEN EXTRACT(EPOCH FROM (ends_in - NOW() AT TIME ZONE 'UTC')) BETWEEN 0 AND 3600 THEN 1000
        ELSE 0
        END
        +
        -- Votes and likes weights
    COALESCE(votes_count, 0) * 2 * likes_count
    )
WHERE id = 'f31e3ec9-e904-4343-8f69-4b66d2435d69'
  AND is_deleted = false
  AND ends_in > NOW() AT TIME ZONE 'UTC';