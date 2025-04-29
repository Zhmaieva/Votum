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
 * Fetch polls for the main feed.
 * If a featured poll is specified, include it first and exclude it from the rest.
 *
 * @param {string} userId - ID of the currently authenticated user
 * @param {string|null} featuredId - Optional readable ID of a featured poll
 * @returns {Promise<Array>} - List of polls for feed
 */
async function fetchPolls(userId, featuredId = null) {
    let fullQuery;
    let params = [userId, featuredId];

    if (featuredId) {
        fullQuery = `
            SELECT * FROM (
                (${pollSelect} ${pollWhere} AND p.readable_id = $2 LIMIT 1)
                UNION ALL
                (${pollSelect} ${pollWhere} AND p.readable_id <> $2)
            ) AS polls
        `;
    } else {
        fullQuery = `${pollSelect} ${pollWhere}`;
        params = [userId];
    }

    const result = await pool.query(fullQuery, params);
    return attachOptionsToPolls(userId, result.rows);
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
    const client = await pool.connect();
    const query = `
        UPDATE polls SET is_deleted = true
        WHERE id = $1 and created_by = $2
    `;

    try {
        await client.query('BEGIN');
        await client.query(query, [pollId, userId]);

        await client.query(`
          INSERT INTO events_queue (entity_id, event_name, event_date)
          VALUES ($1, $2, (NOW() AT TIME ZONE 'UTC'))
          ON CONFLICT (entity_id, event_name) DO NOTHING;
        `, [pollId, EVENT_NAMES.POLL_INDEX_DELETE]);

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting poll:', err);
    } finally {
        client.release();
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
            VALUES ($1, $2, (SELECT NOW() + INTERVAL '${duration}'), $3)
            RETURNING id`,
            [createdBy, question, readableId]
        );

        const pollId = pollInserResult.rows[0].id;

        await client.query(`
          INSERT INTO events_queue (entity_id, event_name, event_date)
          VALUES ($1, $2, (NOW() AT TIME ZONE 'UTC'))
          ON CONFLICT (entity_id, event_name) DO NOTHING;
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
 * @param updatedOn cut off update date (event date) - update older polls only
 * @returns {Promise<void>}
 */
async function recalculatePollScore({ pollId, updatedOn }) {
    const query = `
        WITH eligible_users AS (
            SELECT id AS user_id
            FROM users
        )
        INSERT INTO user_polls (user_id, poll_id, feed_score, updated_at)
        SELECT 
            eu.user_id,
            pc.id,
            CASE 
                -- Calculate feed score
                WHEN up.user_id IS NULL THEN 
                    (
                        COALESCE(
                            CASE 
                                WHEN EXTRACT(EPOCH FROM (NOW() - pc.created_at)) / 3600 < 24
                                THEN 50 - (EXTRACT(EPOCH FROM (NOW() - pc.created_at)) / 3600)
                                ELSE 0
                            END, 0
                        )
                        + (COALESCE(pc.votes_count, 0) * 2)
                        + (COALESCE(pc.likes_count, 0) * 3)
                        + CASE
                            WHEN EXTRACT(EPOCH FROM (pc.ends_in - NOW())) < 3600
                                 AND EXTRACT(EPOCH FROM (pc.ends_in - NOW())) > 0
                            THEN 20
                            ELSE 0
                          END
                        + 1000000000 -- 1kkk bonus if not seen
                    )
                ELSE
                    (
                        COALESCE(
                            CASE 
                                WHEN EXTRACT(EPOCH FROM (NOW() - pc.created_at)) / 3600 < 24
                                THEN 50 - (EXTRACT(EPOCH FROM (NOW() - pc.created_at)) / 3600)
                                ELSE 0
                            END, 0
                        )
                        + (COALESCE(pc.votes_count, 0) * 2)
                        + (COALESCE(pc.likes_count, 0) * 3)
                        + CASE
                            WHEN EXTRACT(EPOCH FROM (pc.ends_in - NOW())) < 3600
                                 AND EXTRACT(EPOCH FROM (pc.ends_in - NOW())) > 0
                            THEN 20
                            ELSE 0
                          END
                    )
            END AS feed_score,
            $2
        FROM eligible_users eu
        JOIN polls pc ON pc.id = $1 AND pc.is_deleted = false AND pc.ends_in > (NOW() AT TIME ZONE 'UTC')
        LEFT JOIN poll_views up ON up.user_id = eu.user_id AND up.poll_id = pc.id
        ON CONFLICT (user_id, poll_id) DO UPDATE
        SET 
            feed_score = CASE
                            WHEN user_polls.updated_at < EXCLUDED.updated_at THEN
                                EXCLUDED.feed_score
                            ELSE
                                user_polls.feed_score
                         END,
            updated_at = CASE
                            WHEN user_polls.updated_at < EXCLUDED.updated_at THEN
                                EXCLUDED.updated_at
                            ELSE
                                user_polls.updated_at
                         END
        WHERE
            user_polls.updated_at < EXCLUDED.updated_at;
    `

    await pool.query(query, [ pollId, updatedOn ]);
}

async function publishPollEvents() {
    const query = `
        WITH now_utc AS (
            SELECT (NOW() AT TIME ZONE 'UTC') AS now
        )
        INSERT INTO events_queue (entity_id, event_name, event_date)
        SELECT p.id, $1, (p.created_at AT TIME ZONE 'UTC')
        FROM polls p
                 LEFT JOIN user_polls up ON p.id = up.poll_id
           , now_utc
        WHERE p.is_deleted = false
          AND (now_utc.now - p.created_at) <= INTERVAL '24 hours'
          AND (up.poll_id IS NULL OR up.updated_at < p.created_at)

        UNION ALL

        SELECT p.id, $1, ((p.ends_in - INTERVAL '1 hour') AT TIME ZONE 'UTC')
        FROM polls p
                 LEFT JOIN user_polls up ON p.id = up.poll_id
           , now_utc
        WHERE p.is_deleted = false
          AND p.ends_in > now_utc.now
          AND p.ends_in <= now_utc.now + INTERVAL '1 hour'
          AND (up.poll_id IS NULL OR up.updated_at < (p.ends_in - INTERVAL '1 hour'))

        UNION ALL

        SELECT DISTINCT up.poll_id, $2, now_utc.now
        FROM user_polls up
                 JOIN polls p ON p.id = up.poll_id
           , now_utc
        WHERE p.is_deleted = true
           OR p.ends_in < now_utc.now

        ON CONFLICT (entity_id, event_name) DO NOTHING;
    `;

    const result = await pool.query(query, [EVENT_NAMES.POLL_INDEX_UPDATE, EVENT_NAMES.POLL_INDEX_DELETE]);

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
    recalculatePollScore,
    searchPolls,
    unlikePoll,
    voteOnPoll,
};
