const {pool} = require("./pool");
const {customAlphabet} = require("nanoid");
const {EVENT_NAMES} = require("../../constants");

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
            endsIn: poll.ends_in,
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


    Object.keys(pollsMap).forEach(pollId => {
        const poll = pollsMap[pollId];
        poll.options = optionsMap[pollId] || [];
    });

    return Object.values(pollsMap);
}

// Base SELECT clause reused in all queries
const pollSelect = `
    SELECT p.id, p.question, p.ends_in, p.readable_id, u.username, up.user_id, up.image,
        up.followers_number,
        CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
        CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
        CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio
        FROM polls p
        JOIN users u ON p.created_by = u.id
        JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN poll_likes pl ON p.id = pl.poll_id AND pl.user_id = $1
        LEFT JOIN user_follows uf ON u.id = uf.user_follow_id AND uf.user_follower_id = $1
`;

// WHERE clause used to filter out expired or deleted polls
const pollWhere = `
    WHERE p.ends_in > NOW() AND p.is_deleted = false
`;

/**
 * Fetches polls for a user based on feed score and featured poll if provided
 * @param userId User ID
 * @param batchSize Number of polls to fetch
 * @param excludedPollIds List of poll IDs to exclude
 * @param featuredId Featured poll readable_id (optional)
 */
async function fetchPolls(userId, batchSize, excludedPollIds, featuredId) {
    const client = await pool.connect();
    try {
        const excludedArray = excludedPollIds.length > 0 ? excludedPollIds : null;
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
                  CASE WHEN p.created_by = $1 THEN up2.bio ELSE '' END AS user_bio
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

            const { rows: featuredRows } = await client.query(featuredQuery, [userId, featuredId]);

            rows = rows.concat(featuredRows);

            if (featuredRows.length > 0) {
                // Exclude the featured poll from further selects
                excludedPollIds = [...excludedPollIds, featuredRows[0].id];
            }
        }

        const excludedArrayFinal = excludedPollIds.length > 0 ? excludedPollIds : null;

        const personalizedQuery = `
            WITH base_polls AS (
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
                    p.feed_score AS effective_score,
                    p.created_at
                FROM polls p
                         JOIN users u ON u.id = p.created_by
                         JOIN user_profiles up2 ON up2.user_id = u.id
                         LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
                         LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
                WHERE p.is_deleted = false
                  AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                  AND p.created_by <> $1
                  AND ($3::uuid[] IS NULL OR p.id != ALL($3))
                  AND NOT EXISTS (
                    SELECT 1 FROM poll_views v
                    WHERE v.poll_id = p.id AND v.user_id = $1
                )
                LIMIT $2
            ),
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
                         CASE WHEN p.created_by = $1 THEN up2.bio ELSE '' END AS user_bio,
                         p.feed_score * 2 AS effective_score,
                         p.created_at
                     FROM polls p
                              JOIN users u ON u.id = p.created_by
                              JOIN user_profiles up2 ON up2.user_id = u.id
                              LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
                              JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
                     WHERE p.is_deleted = false
                       AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
                       AND p.created_by <> $1
                       AND ($3::uuid[] IS NULL OR p.id != ALL($3))
                       AND NOT EXISTS (
                         SELECT 1 FROM poll_views v
                         WHERE v.poll_id = p.id AND v.user_id = $1
                     )
                     LIMIT $2
                 ),
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
            LIMIT $2;
        `;


        const { rows: personalizedRows } = await client.query(personalizedQuery, [userId, batchSize - rows.length, excludedArrayFinal]);

        if (personalizedRows.length > 0) {
            rows = rows.concat(personalizedRows);
            return attachOptionsToPolls(userId, rows);
        }

        // Fallback trending polls
        const fallbackQuery = `
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
            CASE WHEN p.created_by = $1 THEN up2.bio ELSE '' END AS user_bio
          FROM polls p
          JOIN users u ON u.id = p.created_by
          JOIN user_profiles up2 ON up2.user_id = u.id
          LEFT JOIN poll_likes pl ON pl.poll_id = p.id AND pl.user_id = $1
          LEFT JOIN user_follows uf ON uf.user_follower_id = $1 AND uf.user_follow_id = u.id
          WHERE p.is_deleted = false
            AND p.ends_in > (NOW() AT TIME ZONE 'UTC')
            AND ($3::uuid[] IS NULL OR p.id != ALL($3))
          ORDER BY p.votes_count DESC, p.created_at DESC, p.likes_count DESC
          LIMIT $2
        `;

        const { rows: fallbackRows } = await client.query(fallbackQuery, [userId, batchSize - rows.length, excludedArrayFinal]);

        rows = rows.concat(fallbackRows);

        return attachOptionsToPolls(userId, rows);
    } catch (error) {
        console.error('Error fetching user feed polls:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Fetch polls liked by the user.
 * Does not filter out expired polls.
 *
 * @param {string} userId - ID of the currently authenticated user
 * @returns {Promise<Array>} - List of liked polls
 */
async function fetchLikedPolls(userId) {
    const query = `
        ${pollSelect}
        WHERE p.is_deleted = false AND pl.user_id IS NOT NULL
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
            WHERE ${ readable ? 'p.readable_id = $1' : 'p.id = $1' } AND p.ends_in > NOW() AND p.is_deleted = false;
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
 * @returns {Promise<{ text: string, votesCount: number }[] | null>}
 */
const getPollOptionResults = async (pollId) => {
    try {
        const query = `
            SELECT id, text, votes_count AS "votesCount"
            FROM poll_answer_options
            WHERE poll_id = $1
            ORDER BY option_order
        `;

        const result = await pool.query(query, [pollId]);
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
 * Updates score for all users in relation to the poll
 * @param pollId Poll ID
 * @returns {Promise<void>}
 */
async function recalculatePollsScore({ pollIds }) {
    const query = `
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
        WHERE id = ANY($1::uuid[])
          AND is_deleted = false
          AND ends_in > NOW() AT TIME ZONE 'UTC';
    `

    await pool.query(query, [pollIds]);
}

async function publishPollEvents() {
    const query = `
        WITH now_utc AS (
            SELECT (NOW() AT TIME ZONE 'UTC') AS now
        ),
             candidate_events AS (
                 SELECT
                     p.id AS poll_id,
                     (p.created_at + (FLOOR(EXTRACT(EPOCH FROM (now() AT TIME ZONE 'UTC' - p.created_at)) / 3600) * INTERVAL '1 hour')) AS event_date
                 FROM polls p
                 WHERE p.is_deleted = false
                   AND (now() AT TIME ZONE 'UTC' - p.created_at) <= INTERVAL '24 hours'
                   AND p.ends_in > (now() AT TIME ZONE 'UTC')
                   AND (p.indexed_at < (p.created_at + (FLOOR(EXTRACT(EPOCH FROM (now() AT TIME ZONE 'UTC' - p.created_at)) / 3600) * INTERVAL '1 hour') - INTERVAL '1 second'))

                 UNION ALL

                 SELECT
                     p.id AS poll_id,
                     ((p.created_at AT TIME ZONE 'UTC') + INTERVAL '24 hours') AS event_date
                 FROM polls p
                 WHERE p.is_deleted = false
                   AND (now() AT TIME ZONE 'UTC' - p.created_at) > INTERVAL '24 hours'
                   AND p.ends_in > (now() AT TIME ZONE 'UTC')
                   AND (p.indexed_at < ((p.created_at AT TIME ZONE 'UTC') + INTERVAL '24 hours' - INTERVAL '1 second'))

                 UNION ALL

                 SELECT
                     p.id AS poll_id,
                     ((p.ends_in - INTERVAL '1 hour') AT TIME ZONE 'UTC') AS event_date
                 FROM polls p
                 WHERE p.is_deleted = false
                   AND p.ends_in > (now() AT TIME ZONE 'UTC')
                   AND p.ends_in <= (now() AT TIME ZONE 'UTC') + INTERVAL '1 hour'
                   AND (p.indexed_at < (p.ends_in - INTERVAL '1 hour' - INTERVAL '1 second'))
             ),
             limited_candidates AS (
                 SELECT *
                 FROM candidate_events
                 ORDER BY event_date ASC
                 LIMIT 50
             ),
             inserted AS (
                 INSERT INTO events_queue (entity_id, event_name, event_date)
                     SELECT poll_id, $1, event_date
                     FROM limited_candidates
                     RETURNING entity_id
             )
        UPDATE polls
        SET indexed_at = (NOW() AT TIME ZONE 'UTC')
        FROM inserted
        WHERE polls.id = inserted.entity_id;
    `

    const result = await pool.query(query, [EVENT_NAMES.POLL_INDEX_UPDATE]);

    if (result?.rowCount > 0)
        console.log(`Published ${result?.rowCount} events.`);
}

module.exports = {
    createPoll,
    deletePoll,
    fetchPolls,
    fetchUserPolls,
    fetchTrendingPolls,
    fetchLikedPolls,
    getPollById,
    getPollOptionResults,
    likePoll,
    publishPollEvents,
    recalculatePollsScore,
    searchPolls,
    unlikePoll,
    viewPoll,
    voteOnPoll,
};
