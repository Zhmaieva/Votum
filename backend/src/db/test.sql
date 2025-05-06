-- 1. Generate Users and Profiles
DO $$
    BEGIN
        FOR i IN 1..10000 LOOP
                INSERT INTO users (id, username, email, password_hash)
                VALUES (
                           gen_random_uuid(),
                           'user_' || i,
                           'user_' || i || '@autotest.com',
                           'hashed_password'
                       );

                INSERT INTO user_profiles (user_id, image, bio)
                VALUES (
                           (SELECT id FROM users WHERE username = 'user_' || i),
                           'https://example.com/default-avatar.jpg',
                           substring(md5(random()::text), 1, 30)
                       );
            END LOOP;
    END;
$$;

-- 2. Create Polls and Answer Options
DO $$
    DECLARE
        user_rec RECORD;
        poll_id UUID;
        option_id UUID;
        expiration INTERVAL;
    BEGIN
        FOR user_rec IN SELECT id FROM users LOOP
                FOR i IN 1..100 LOOP
                        poll_id := gen_random_uuid();
                        expiration := (ARRAY['1 day', '7 days', '30 days'])[floor(random() * 3 + 1)];

                        INSERT INTO polls (id, created_by, question, ends_in)
                        VALUES (
                                   poll_id,
                                   user_rec.id,
                                   'Sample question ' || i,
                                   NOW() + expiration
                               );

                        FOR j IN 1..4 LOOP
                                option_id := gen_random_uuid();
                                INSERT INTO poll_answer_options (id, poll_id, text, option_order)
                                VALUES (
                                           option_id,
                                           poll_id,
                                           'Option ' || j,
                                           j
                                       );
                            END LOOP;
                    END LOOP;
            END LOOP;
    END;
$$;

-- 3. Populate poll_likes, poll_votes, and poll_views
DO $$
    DECLARE
        poll_rec RECORD;
        user_ids UUID[];
        selected_users UUID[];
        option_ids UUID[];
        selected_option UUID;
        selected_user UUID; -- ✅ Declare the loop variable
    BEGIN
        SELECT array_agg(id) INTO user_ids FROM users;

        FOR poll_rec IN SELECT id FROM polls LIMIT 1000 LOOP
                -- Randomly select 10 users for interactions
                selected_users := (SELECT array_agg(id) FROM (
                                                                 SELECT unnest(user_ids) AS id ORDER BY random() LIMIT 10
                                                             ) sub);

                -- Get options for the current poll
                SELECT array_agg(id) INTO option_ids FROM poll_answer_options WHERE poll_id = poll_rec.id;

                FOREACH selected_user IN ARRAY selected_users LOOP
                        -- Insert into poll_likes
                        INSERT INTO poll_likes (user_id, poll_id)
                        VALUES (selected_user, poll_rec.id)
                        ON CONFLICT DO NOTHING;

                        -- Insert into poll_votes
                        selected_option := option_ids[floor(random() * array_length(option_ids, 1) + 1)];
                        INSERT INTO poll_votes (user_id, poll_id, option_id)
                        VALUES (selected_user, poll_rec.id, selected_option)
                        ON CONFLICT DO NOTHING;

                        -- Insert into poll_views
                        INSERT INTO poll_views (poll_id, user_id)
                        VALUES (poll_rec.id, selected_user)
                        ON CONFLICT DO NOTHING;
                    END LOOP;
            END LOOP;
    END;
$$;

-- 4. Establish follow relationships for the specified user
DO $$
    DECLARE
        all_users UUID[];
        selected_users UUID[];
    BEGIN
        SELECT array_agg(id) INTO all_users FROM users WHERE id != 'e33751cb-b1cd-481e-86ed-0d493885e60b';

        -- Select approximately 1% of users to follow
        selected_users := (SELECT array_agg(id) FROM (
                                                         SELECT unnest(all_users) AS id ORDER BY random() LIMIT 100
                                                     ) sub);

        FOREACH followee IN ARRAY selected_users LOOP
                INSERT INTO user_follows (user_follower_id, user_follow_id)
                VALUES ('e33751cb-b1cd-481e-86ed-0d493885e60b', followee)
                ON CONFLICT DO NOTHING;
            END LOOP;
    END;
$$;







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
