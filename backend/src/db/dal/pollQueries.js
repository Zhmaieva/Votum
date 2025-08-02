const {pool} = require("./pool");
const {customAlphabet} = require("nanoid");
const {EVENT_NAMES} = require("../../constants");
const {promise} = require("bcrypt/promises");

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const customNanoid = customAlphabet(alphabet, 6); // 6-char all caps

/**
 * Helper function to fetch poll answer options and attach them to their corresponding polls.
 * Also checks if the current user has voted on each option.
 *
 * @param {string} userId - ID of the currently authenticated user
 * @param {Array} polls - List of polls to attach options to
 * @returns {Promise<Array>} - Polls with attached options
 */
async function attachOptionsToPolls(userId, polls) {
    const pollsMap = {};
    polls.forEach(poll => {
        pollsMap[poll.id] = {
            id: poll.id,
            question: poll.question,
            options: [],
            endsIn: new Date(poll.ends_in.replace(' ', 'T') + 'Z').toISOString(),
            isLiked: poll.is_liked,
            user: {
                userId: poll.user_id,
                username: poll.username,
                image: poll.image,
                followersNumber: poll.followers_number < 0 ? 0 : poll.followers_number,
                isFollowing: poll.is_following,
                bio: poll.user_bio
            }
        };
    });

    const pollIds = polls.map(p => p.id);
    const optionsQuery = `
        SELECT pao.id, pao.poll_id, pao.text, pao.votes_count as "votesCount",
               CASE WHEN pv.user_id IS NOT NULL THEN true ELSE false END AS voted
        FROM poll_answer_options pao
                 LEFT JOIN poll_votes pv ON pv.option_id = pao.id AND pv.user_id = $1
        WHERE pao.poll_id = ANY($2)
        ORDER BY pao.option_order;
    `;
    const optionsResult = await pool.query(optionsQuery, [userId, pollIds]);

    const optionsMap = {};
    optionsResult.rows.forEach(row => {
        if (!optionsMap[row.poll_id]) optionsMap[row.poll_id] = [];
        optionsMap[row.poll_id].push({ id: row.id, text: row.text, voted: row.voted, votesCount: row.votesCount });
    });

    // Fetch total votes per author
    const authorIds = [...new Set(polls.map(p => p.user_id))];
    const votesPerAuthorQuery = `
        SELECT created_by AS user_id, COALESCE(SUM(votes_count), 0)::INTEGER AS total_votes
        FROM polls
        WHERE created_by = ANY($1) AND is_deleted = false
        GROUP BY created_by;
    `;
    const votesResult = await pool.query(votesPerAuthorQuery, [authorIds]);

    const votesByUser = {};
    votesResult.rows.forEach(row => {
        votesByUser[row.user_id] = row.total_votes;
    });


    Object.keys(pollsMap).forEach(pollId => {
        const poll = pollsMap[pollId];
        poll.options = optionsMap[pollId] || [];
        poll.user.totalVotesNumber = votesByUser[poll.user.userId] ?? 0;
    });

    return Object.values(pollsMap);
}

// Base SELECT clause reused in all queries
const pollSelect = `
    SELECT p.id, p.question, p.ends_in AS ends_in, p.readable_id, u.username, up.user_id, up.image,
        up.followers_number,
        CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
        CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
        CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio
        FROM polls p
        JOIN users u ON p.created_by = u.id
        JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN poll_likes pl ON p.id = pl.poll_id AND pl.user_id = $1
        LEFT JOIN poll_votes pv ON p.id = pv.poll_id AND pv.user_id = $1
        LEFT JOIN user_follows uf ON u.id = uf.user_follow_id AND uf.user_follower_id = $1
`;

// WHERE clause used to filter out expired or deleted polls
const pollWhere = `
    WHERE p.ends_in > NOW() AND p.is_deleted = false
`;

/**
 * Fetches polls for a user based on feed score and featured poll if provided
 * @param userId User ID
 * @param featuredId Featured poll readable_id (optional)
 */
async function fetchPolls(userId, featuredId) {
    try {
        let rows = [];

        if (featuredId) {
            const featuredQuery = `
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
                  CASE WHEN p.created_by = $1 THEN up2.bio ELSE '' END AS user_bio,
                  p.category_id,
                  p.duration_type
                FROM polls p
                JOIN users u ON u.id = p.created_by
                JOIN user_profiles up2 ON up2.user_id = u.id
                LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
                LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
                WHERE p.is_deleted = false
                  AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                  AND p.readable_id = $2
                LIMIT 1
              `;

            const { rows: featuredRows } = await pool.query(featuredQuery, [userId, featuredId]);

            rows = rows.concat(featuredRows);
        }

        const topPopular = `
            WITH chosen_categories AS (
                SELECT category_id, score
                FROM user_categories
                WHERE user_id = $1 AND is_chosen = true
            ),
                 category_random_weights AS (
                     SELECT category_id, score, random() * score AS weighted_score
                     FROM chosen_categories
                 ),
                 polls_ranked_by_category AS (
                     SELECT
                         p.id,
                         p.question,
                         p.ends_in,
                         p.readable_id,
                         u.username,
                         up.user_id,
                         up.image,
                         up.followers_number,
                         CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                         CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
                         CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                         p.likes_per_vote AS effective_score,
                         p.created_at,
                         p.votes_count,
                         crw.weighted_score AS category_weight,
                         p.category_id,
                         p.duration_type
                     FROM polls p
                              JOIN category_random_weights crw ON crw.category_id = p.category_id
                              JOIN users u ON u.id = p.created_by
                              JOIN user_profiles up ON up.user_id = u.id
                              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
                              LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
                     WHERE p.is_deleted = false
                       AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                       AND p.created_by <> $1
                       AND NOT EXISTS (
                           SELECT 1 FROM poll_views v
                           WHERE v.poll_id = p.id AND v.user_id = $1
                       )
                 )
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
                user_bio,
                category_id,
                duration_type
            FROM polls_ranked_by_category
            ORDER BY category_weight DESC, votes_count DESC, ends_in ASC
            LIMIT 10;
        `;

        const followEngaging = `
            WITH followed_polls AS (
              SELECT
                p.id,
                p.question,
                p.ends_in,
                p.readable_id,
                u.username,
                up.user_id,
                up.image,
                up.followers_number,
                CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                TRUE AS is_following,
                CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                p.likes_per_vote AS effective_score,
                p.created_at,
                p.category_id,
                p.duration_type
              FROM polls p
              JOIN users u ON u.id = p.created_by
              JOIN user_profiles up ON up.user_id = u.id
              JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
              WHERE p.is_deleted = false
                AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                AND p.created_by <> $1
                AND NOT EXISTS (
                  SELECT 1 FROM poll_views v
                  WHERE v.poll_id = p.id AND v.user_id = $1
                )
            )
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
              user_bio,
              category_id,
              duration_type
            FROM followed_polls
            ORDER BY effective_score DESC, ends_in ASC
            LIMIT 10;
        `

        const newlyCreated = `
            WITH newly_created_polls AS (
              SELECT p.*
              FROM polls p
              WHERE p.is_deleted = false
                AND p.created_by <> $1
                AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                AND (
                  (p.duration_type = 1 AND p.created_at > (NOW() AT TIME ZONE 'UTC' - INTERVAL '15 minutes')) OR
                  (p.duration_type = 2 AND p.created_at BETWEEN (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 hour') AND (NOW() AT TIME ZONE 'UTC' - INTERVAL '15 minutes')) OR
                  (p.duration_type = 3 AND p.created_at BETWEEN (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day') AND (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 hour')) OR
                  (p.duration_type = 4 AND p.created_at BETWEEN (NOW() AT TIME ZONE 'UTC' - INTERVAL '3 days') AND (NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day'))
                )
            ),
            chosen_category AS (
              SELECT category_id
              FROM user_categories
              WHERE user_id = $1 AND is_chosen = true
              ORDER BY RANDOM() * score DESC
              LIMIT 1
            ),
            joined_polls AS (
              SELECT
                p.id,
                p.question,
                p.ends_in,
                p.readable_id,
                u.username,
                up.user_id,
                up.image,
                up.followers_number,
                CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
                CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                p.likes_per_vote AS effective_score,
                p.created_at,
                p.duration_type,
                p.category_id
              FROM newly_created_polls p
              JOIN chosen_category cc ON cc.category_id = p.category_id
              JOIN users u ON u.id = p.created_by
              JOIN user_profiles up ON up.user_id = u.id
              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
              LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
              WHERE NOT EXISTS (
                  SELECT 1 FROM poll_views v
                  WHERE v.poll_id = p.id AND v.user_id = $1
                  )
            )
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
              user_bio,
              category_id,
              duration_type
            FROM joined_polls
            ORDER BY effective_score DESC, duration_type, ends_in
            LIMIT 10;
        `;

        const topEngaging = `
            WITH chosen_categories AS (
                SELECT category_id, score
                FROM user_categories
                WHERE user_id = $1 AND is_chosen = true
            ),
                 category_random_weights AS (
                     SELECT category_id, score, random() * score AS weighted_score
                     FROM chosen_categories
                 ),
                 polls_ranked_by_category AS (
                     SELECT
                         p.id,
                         p.question,
                         p.ends_in,
                         p.readable_id,
                         u.username,
                         up.user_id,
                         up.image,
                         up.followers_number,
                         CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                         CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
                         CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                         p.likes_per_vote AS effective_score,
                         p.created_at,
                         p.votes_count,
                         crw.weighted_score AS category_weight,
                         p.category_id,
                         p.duration_type
                     FROM polls p
                              JOIN category_random_weights crw ON crw.category_id = p.category_id
                              JOIN users u ON u.id = p.created_by
                              JOIN user_profiles up ON up.user_id = u.id
                              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
                              LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
                     WHERE p.is_deleted = false
                       AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                       AND p.created_by <> $1
                       AND NOT EXISTS (
                           SELECT 1 FROM poll_views v
                           WHERE v.poll_id = p.id AND v.user_id = $1
                       )
                 )
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
                user_bio,
                category_id,
                duration_type
            FROM polls_ranked_by_category
            ORDER BY category_weight DESC, effective_score DESC, ends_in ASC
            LIMIT 10;
        `;

        const followPopular = `
            WITH followed_polls AS (
              SELECT
                p.id,
                p.question,
                p.ends_in,
                p.readable_id,
                u.username,
                up.user_id,
                up.image,
                up.followers_number,
                CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                TRUE AS is_following,
                CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                p.votes_count,
                p.created_at,
                p.category_id,
                p.duration_type
              FROM polls p
              JOIN users u ON u.id = p.created_by
              JOIN user_profiles up ON up.user_id = u.id
              JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
              WHERE p.is_deleted = false
                AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                AND p.created_by <> $1
                AND NOT EXISTS (
                  SELECT 1 FROM poll_views v
                  WHERE v.poll_id = p.id AND v.user_id = $1
                )
            )
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
              user_bio,
              category_id,
              duration_type
            FROM followed_polls
            ORDER BY votes_count DESC, ends_in ASC
            LIMIT 10;
        `;

        const topPopularNotChosen = `
            WITH selected_categories AS (
                SELECT category_id, score
                FROM user_categories
                WHERE user_id = $1 AND is_chosen = false
            ),
                 category_random_weights AS (
                     SELECT category_id, score, random() * score AS weighted_score
                     FROM selected_categories
                 ),
                 polls_ranked_by_category AS (
                     SELECT
                         p.id,
                         p.question,
                         p.ends_in,
                         p.readable_id,
                         u.username,
                         up.user_id,
                         up.image,
                         up.followers_number,
                         CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                         CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
                         CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                         p.likes_per_vote AS effective_score,
                         p.created_at,
                         p.votes_count,
                         crw.weighted_score AS category_weight,
                         p.category_id,
                         p.duration_type
                     FROM polls p
                              JOIN category_random_weights crw ON crw.category_id = p.category_id
                              JOIN users u ON u.id = p.created_by
                              JOIN user_profiles up ON up.user_id = u.id
                              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
                              LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
                     WHERE p.is_deleted = false
                       AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                       AND p.created_by <> $1
                       AND NOT EXISTS (
                           SELECT 1 FROM poll_views v
                           WHERE v.poll_id = p.id AND v.user_id = $1
                       )
                 )
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
                user_bio,
                category_id,
                duration_type
            FROM polls_ranked_by_category
            ORDER BY category_weight DESC, votes_count DESC, ends_in ASC
            LIMIT 10;
        `;

        const topEngagingNotChosen = `
            WITH selected_categories AS (
                SELECT category_id, score
                FROM user_categories
                WHERE user_id = $1 AND is_chosen = false
            ),
                 category_random_weights AS (
                     SELECT category_id, score, random() * score AS weighted_score
                     FROM selected_categories
                 ),
                 polls_ranked_by_category AS (
                     SELECT
                         p.id,
                         p.question,
                         p.ends_in,
                         p.readable_id,
                         u.username,
                         up.user_id,
                         up.image,
                         up.followers_number,
                         CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                         CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
                         CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                         p.likes_per_vote AS effective_score,
                         p.created_at,
                         p.votes_count,
                         crw.weighted_score AS category_weight,
                         p.category_id,
                         p.duration_type
                     FROM polls p
                              JOIN category_random_weights crw ON crw.category_id = p.category_id
                              JOIN users u ON u.id = p.created_by
                              JOIN user_profiles up ON up.user_id = u.id
                              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
                              LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
                     WHERE p.is_deleted = false
                       AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                       AND p.created_by <> $1
                       AND NOT EXISTS (
                           SELECT 1 FROM poll_views v
                           WHERE v.poll_id = p.id AND v.user_id = $1
                       )
                 )
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
                user_bio,
                category_id,
                duration_type
            FROM polls_ranked_by_category
            ORDER BY category_weight DESC, effective_score DESC, ends_in ASC
            LIMIT 10;
        `;

        const [
            topPopularQuery,
            followEngagingQuery,
            newlyCreatedQuery,
            topEngagingQuery,
            followPopularQuery,
            topPopularNotChosenQuery,
            topEngagingNotChosenQuery,,
        ] = await Promise.all([
            pool.query(topPopular, [userId]),
            pool.query(followEngaging, [userId]),
            pool.query(newlyCreated, [userId]),
            pool.query(topEngaging, [userId]),
            pool.query(followPopular, [userId]),
            pool.query(topPopularNotChosen, [userId]),
            pool.query(topEngagingNotChosen, [userId]),
        ]);

        // console.log('1. Top popular polls:', topPopularQuery.rows);
        // console.log('2. Follow engaging polls:', followEngagingQuery.rows);
        // console.log('3. Newly created polls:', newlyCreatedQuery.rows);
        // console.log('4. Top engaging polls:', topEngagingQuery.rows);
        // console.log('5. Follow popular polls:', followPopularQuery.rows);
        // console.log('6. Top popular polls (other categories):', topPopularNotChosenQuery.rows);
        // console.log('9. Top engaging polls (other categories):', topEngagingNotChosenQuery.rows);

        const finalFeedTracks = buildFinalFeedTracks({
            topPopularQuery,
            followEngagingQuery,
            newlyCreatedQuery,
            topEngagingQuery,
            followPopularQuery,
            topPopularNotChosenQuery,
            topEngagingNotChosenQuery,
        });

        rows = rows.concat(finalFeedTracks);

        const seen = new Set();
        rows = rows.filter(item => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });

        return attachOptionsToPolls(userId, rows);
    } catch (error) {
        console.error('Error fetching user feed polls:', error);
    }
}

// Finalize feed array with 11 ranked slots and soft constraints
function buildFinalFeedTracks(trackResults) {
    const finalFeed = [];
    const usedIds = new Set();

    let lastUser = null;
    let lastCat = null;
    let lastDur = null;
    let streakUser = 0;
    let streakCat = 0;
    let streakDur = 0;

    // Helper to try adding a poll from a track with constraints
    const tryAdd = (polls, force = false) => {
        for (const poll of polls) {
            if (usedIds.has(poll.id)) continue;

            const { user_id, category_id, duration_type } = poll;

            const sameUser = user_id === lastUser;
            const sameCat = category_id === lastCat;
            const sameDur = duration_type === lastDur;

            if (!force)
                if ((sameUser && streakUser >= 2) ||
                    (sameCat && streakCat >= 2) ||
                    (sameDur && streakDur >= 2)) {
                    continue;
                }

            finalFeed.push(poll);
            usedIds.add(poll.id);

            // update streaks
            streakUser = sameUser ? streakUser + 1 : 1;
            lastUser = user_id;

            streakCat = sameCat ? streakCat + 1 : 1;
            lastCat = category_id;

            streakDur = sameDur ? streakDur + 1 : 1;
            lastDur = duration_type;

            return true;
        }
        return false;
    };

    const tracks = [
        trackResults.topPopularQuery,
        trackResults.followEngagingQuery,
        trackResults.newlyCreatedQuery,
        trackResults.topEngagingQuery,
        trackResults.followPopularQuery,
        trackResults.topPopularNotChosenQuery,
        trackResults.topEngagingQuery,         // slot 7 reuse
        trackResults.followEngagingQuery,      // slot 8 reuse
        trackResults.topEngagingNotChosenQuery,// slot 9
        trackResults.topPopularQuery,          // slot 10 reuse
        trackResults.followPopularQuery        // slot 11 reuse
    ];

    // Fill initial 11 slots
    let attempts = 0;
    while (finalFeed.length < 11 && attempts < 22) {
        const slot = finalFeed.length;
        const source = tracks[slot].rows || tracks[slot % tracks.length].rows;
        tryAdd(source);
        attempts++;
    }

    // Fill remaining if underfilled
    let fallback = 0;
    while (finalFeed.length < 11 && fallback < tracks.length * 2) {
        tryAdd(tracks[fallback % tracks.length].rows, true);
        fallback++;
    }

    return finalFeed;
}

/**
 * Fetch polls liked by the user.
 * Does not filter out expired polls.
 *
 * @param {string} userId - ID of the currently authenticated user
 * @returns {Promise<Array>} - List of liked polls
 */
async function fetchVotedPolls(userId) {
    const query = `
        ${pollSelect}
        WHERE p.is_deleted = false AND pv.user_id IS NOT NULL
    `;
    const result = await pool.query(query, [userId]);
    return attachOptionsToPolls(userId, result.rows);
}

/**
 * Fetch all polls created by a specific user.
 *
 * @param {string} requestingUserId - ID of the current user (used for like/follow state)
 * @param {string} targetUserId - ID of the user whose polls to fetch
 * @returns {Promise<Array>} - List of polls created by the user
 */
async function fetchUserPolls(requestingUserId, targetUserId) {
    const query = `
        ${pollSelect}
        WHERE p.is_deleted = false AND p.created_by = $2
        ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query, [requestingUserId, targetUserId]);
    return attachOptionsToPolls(requestingUserId, result.rows);
}

/**
 * Fetch all polls by filter criteria
 *
 * @param {string} requestingUserId - ID of the current user (used for like/follow state)
 * @param {string} filterQuery - filter criteria
 * @returns {Promise<Array>} - List of polls created by the user
 */
async function searchPolls(requestingUserId, filterQuery) {
    const query = `
        SELECT DISTINCT p.id, p.question, p.ends_in, p.readable_id, u.username, up.user_id, up.image,
               up.followers_number,
               CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
               CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
               CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio
        FROM polls p
        JOIN users u ON p.created_by = u.id
        JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN poll_likes pl ON p.id = pl.poll_id AND pl.user_id = $1
        LEFT JOIN user_follows uf ON u.id = uf.user_follow_id AND uf.user_follower_id = $1
        LEFT JOIN poll_answer_options pao ON pao.poll_id = p.id
        WHERE p.is_deleted = false
          AND (
                p.question ILIKE '%' || $2 || '%' OR
                pao.text ILIKE '%' || $2 || '%'
          )
        ORDER BY p.ends_in DESC;
    `;
    const result = await pool.query(query, [requestingUserId, filterQuery]);
    return attachOptionsToPolls(requestingUserId, result.rows);
}

/**
 * Fetch trending polls for the main feed.
 * Uses the same logic as regular feed (filtered for active polls).
 *
 * @param {string} userId - ID of the currently authenticated user
 * @returns {Promise<Array>} - List of trending polls
 */
async function fetchTrendingPolls(userId) {
    const result = await pool.query(`${pollSelect} ${pollWhere} ORDER BY p.votes_count DESC`, [userId]);
    return attachOptionsToPolls(userId, result.rows);
}

const getPollById = async (pollId, readable = false) => {
    try {
        const pollQuery = `
            SELECT p.id,
                   p.question,
                   p.ends_in,
                   p.readable_id,
                   u.username,
                   up.user_id,
                   up.image,
                   up.followers_number
            FROM polls p
                     JOIN users u ON p.created_by = u.id
                     JOIN user_profiles up ON u.id = up.user_id
            WHERE ${ readable ? 'p.readable_id = $1' : 'p.id = $1' } ${ readable ? '' : 'AND p.ends_in > NOW()' } AND p.is_deleted = false;
        `;

        const pollResult = await pool.query(pollQuery, [pollId]);

        if (pollResult.rows.length === 0) return null;

        const pollRow = pollResult.rows[0];

        const optionsQuery = `
            SELECT
                pao.id,
                pao.poll_id,
                pao.text,
                pao.votes_count as "votesCount"
            FROM poll_answer_options pao
            WHERE pao.poll_id = $1
            ORDER BY pao.option_order;
        `;

        const optionsResult = await pool.query(optionsQuery, [pollRow?.id ?? '']);

        const options = optionsResult.rows.map(row => ({
            id: row.id,
            text: row.text,
            voted: row.voted,
            votesCount: row.votesCount
        }));

        return {
            id: pollRow.id,
            question: pollRow.question,
            endsIn: pollRow.ends_in,
            readableId: pollRow.readable_id,
            options,
            user: {
                userId: pollRow.user_id,
                username: pollRow.username,
                image: pollRow.image,
                followersNumber: pollRow.followers_number < 0 ? 0 : pollRow.followers_number,
                bio: pollRow.user_bio
            }
        };
    } catch (err) {
        console.error('Error fetching poll by ID:', err);
        return null;
    }
};

/**
 * Fetches options for a single poll, sorted by option_order ascending.
 * @param {string} pollId - ID of the poll
 * @param {string} userId - ID of the user
 * @returns {Promise<{ text: string, votesCount: number }[] | null>}
 */
const getPollOptionResults = async (pollId, userId) => {
    try {
        const query = `
            SELECT pao.id, pao.text, pao.votes_count AS "votesCount",
                   bool_or(CASE
                       WHEN pv.user_id = $2
                           THEN true
                       ELSE false
                       END) AS "voted"
            FROM poll_answer_options pao
                     LEFT JOIN poll_votes pv ON pao.id = pv.option_id
            WHERE pao.poll_id = $1
            GROUP BY pao.id
            ORDER BY pao.option_order
        `;

        const result = await pool.query(query, [pollId, userId]);
        return result.rows;
    } catch (err) {
        console.error('Error fetching poll options:', err);
        return null;
    }
};

/**
 * Records a poll view by a user and enqueues a `poll_index_update` event if it’s the first view by that user.
 *
 * @param {string} userId - ID of the user viewing the poll
 * @param {string} pollId - ID of the poll being viewed
 * @returns {Promise<void>}
 */
async function viewPoll(userId, pollId) {
    try {
        // Try inserting a new view
        await pool.query(
            `
                INSERT INTO poll_views (user_id, poll_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING;
            `,
            [userId, pollId]
        );
    } catch (err) {
        console.error('Error recording poll view:', err);
    }
}

async function likePoll(pollId, userId) {
    const query = `
    INSERT INTO poll_likes (poll_id, user_id) 
    VALUES ($1, $2)
    ON CONFLICT (poll_id, user_id) DO NOTHING; -- Prevent duplicate likes
  `;

    try {
        await pool.query(query, [pollId, userId]);
    } catch (err) {
        console.error('Error liking poll:', err);
    }
}

async function sharePoll(pollId, userId) {
    const query = `
    INSERT INTO poll_shares (poll_id, user_id) 
    VALUES ($1, $2)
    ON CONFLICT (poll_id, user_id) DO NOTHING; -- Prevent duplicate likes
  `;

    try {
        await pool.query(query, [pollId, userId]);
    } catch (err) {
        console.error('Error sharing poll:', err);
    }
}

async function unlikePoll(pollId, userId) {
    const query = `
    DELETE FROM poll_likes 
    WHERE poll_id = $1 AND user_id = $2;
  `;

    try {
        await pool.query(query, [pollId, userId]);
    } catch (err) {
        console.error('Error unliking poll:', err);
    }
}

async function deletePoll(pollId, userId) {
    const query = `
        UPDATE polls SET is_deleted = true
        WHERE id = $1 and created_by = $2
    `;

    try {
        await pool.query(query, [pollId, userId]);
    } catch (err) {
        console.error('Error deleting poll:', err);
    }
}

/**
 * Creates a new poll with 2 to 4 answer options.
 * @param {UUID} createdBy - The user creating the poll
 * @param {string} question - The poll question
 * @param {string[]} options - Array of 2 to 4 answer texts
 * @param {string} duration - Time until expiration
 * @returns {Promise<{ pollId: string }>}
 */
async function createPoll(createdBy, question, options, duration) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const readableId = customNanoid(8);

        const pollInserResult = await client.query(
            `
            INSERT INTO polls (created_by, question, ends_in, readable_id)
            VALUES ($1, $2, (SELECT (NOW() AT TIME ZONE 'UTC') + INTERVAL '${duration}'), $3)
            RETURNING id`,
            [createdBy, question, readableId]
        );

        const pollId = pollInserResult.rows[0].id;

        await client.query(`
          INSERT INTO events_queue (entity_id, event_name, event_date)
          VALUES ($1, $2, (NOW() AT TIME ZONE 'UTC'));
        `, [pollId, EVENT_NAMES.POLL_INDEX_UPDATE]);

        const queries = [];
        for (let i = 0; i < options.length; i++) {
            queries.push(client.query(
                `
                INSERT INTO poll_answer_options (poll_id, text, option_order)
                VALUES ($1, $2, $3)`,
                [pollId, options[i], i]
            ));
        }
        await Promise.all(queries);

        await client.query('COMMIT');
        return { pollId };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Vote on poll
 * @param userId
 * @param optionId
 * @returns {Promise<{success: boolean}|{success: boolean, error}>}
 */
async function voteOnPoll({ userId, optionId }) {
    const query = `
        INSERT INTO poll_votes (user_id, poll_id, option_id)
        SELECT $1, pao.poll_id, pao.id
        FROM poll_answer_options pao
        JOIN polls p ON p.id = pao.poll_id
        WHERE pao.id = $2 AND p.ends_in > NOW()
        ON CONFLICT (user_id, poll_id) DO NOTHING
    `;

    try {
        await pool.query(query, [userId, optionId]);
        return { success: true };
    } catch (err) {
        console.error('Vote failed:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Updates likes_per_vote for given polls using Wilson score
 * @param pollId Poll ID
 * @returns {Promise<void>}
 */
async function recalculatePollsScore({ pollIds }) {
    const query = `
        WITH voted_and_liked AS (
          SELECT
            p.id AS poll_id,
            COUNT(DISTINCT pv.user_id) AS votes,
            COUNT(DISTINCT pl.user_id) AS likes
          FROM polls p
          JOIN poll_votes pv ON p.id = pv.poll_id
          LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = pv.user_id
          WHERE p.id = ANY($1::uuid[])
          GROUP BY p.id
        ),
        scores AS (
          SELECT
            poll_id,
            votes,
            likes,
            CASE
              WHEN votes > 0 THEN (
                (
                  (likes::float / votes) + (1.96^2 / (2 * votes))
                  - 1.96 * sqrt(
                      ((likes::float / votes) * (1 - (likes::float / votes)) / votes)
                      + (1.96^2 / (4 * votes * votes))
                  )
                ) / (1 + (1.96^2 / votes))
              )
              ELSE NULL
            END AS raw_score
          FROM voted_and_liked
        )
        UPDATE polls
        SET
          votes_count = s.votes,
          likes_per_vote = (
            CASE
              WHEN s.raw_score IS NULL THEN NULL
              WHEN s.raw_score < 0.001 THEN 0
              ELSE s.raw_score
            END
          )
        FROM scores s
        WHERE polls.id = s.poll_id;
    `

    await pool.query(query, [pollIds]);
}

module.exports = {
    createPoll,
    deletePoll,
    fetchPolls,
    fetchUserPolls,
    fetchTrendingPolls,
    fetchVotedPolls,
    getPollById,
    getPollOptionResults,
    likePoll,
    recalculatePollsScore,
    searchPolls,
    sharePoll,
    unlikePoll,
    viewPoll,
    voteOnPoll,
};
