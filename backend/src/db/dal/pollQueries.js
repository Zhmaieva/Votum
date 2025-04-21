const {pool} = require("./pool");
const {customAlphabet} = require("nanoid");

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const customNanoid = customAlphabet(alphabet, 6); // 6-char all caps

const fetchPolls = async (userId, featuredId) => {
    try {
        if (!featuredId) {
            featuredId = null;
        }

        const pollsQuery = `
            SELECT * FROM (
                              -- Step 1: Featured poll (if provided)
                              SELECT p.id,
                                     p.question,
                                     p.ends_in,
                                     u.username,
                                     up.user_id,
                                     up.image,
                                     up.followers_number,
                                     CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                                     CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
                                     CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                                     0 AS sort_order
                              FROM polls p
                                       JOIN users u ON p.created_by = u.id
                                       JOIN user_profiles up ON u.id = up.user_id
                                       LEFT JOIN poll_likes pl ON p.id = pl.poll_id AND pl.user_id = $1
                                       LEFT JOIN user_follows uf ON u.id = uf.user_follow_id AND uf.user_follower_id = $1
                            WHERE ($2 IS NOT NULL AND p.readable_id = $2)

                              UNION ALL

                              -- Step 2: All other polls, excluding featured
                              SELECT p.id,
                                     p.question,
                                     p.ends_in,
                                     u.username,
                                     up.user_id,
                                     up.image,
                                     up.followers_number,
                                     CASE WHEN pl.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
                                     CASE WHEN uf.user_follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following,
                                     CASE WHEN p.created_by = $1 THEN up.bio ELSE '' END AS user_bio,
                                     1 AS sort_order
                              FROM polls p
                                       JOIN users u ON p.created_by = u.id
                                       JOIN user_profiles up ON u.id = up.user_id
                                       LEFT JOIN poll_likes pl ON p.id = pl.poll_id AND pl.user_id = $1
                                       LEFT JOIN user_follows uf ON u.id = uf.user_follow_id AND uf.user_follower_id = $1
                              WHERE p.ends_in > NOW() AND p.is_deleted = false
                                AND ($2 IS NULL OR p.readable_id <> $2)
                          ) all_polls
            ORDER BY sort_order;
        `;

        const pollsResult = await pool.query(pollsQuery, [userId, featuredId ?? null]);
        const pollIds = pollsResult.rows.map(row => row.id);

        const optionsQuery = `
            SELECT
                pao.id,
                pao.poll_id,
                pao.text,
                pao.votes_count as "votesCount",
                CASE
                    WHEN pv.user_id IS NOT NULL THEN true
                    ELSE false
                    END AS voted
            FROM poll_answer_options pao
                     LEFT JOIN poll_votes pv
                               ON pv.option_id = pao.id AND pv.user_id = $1
            WHERE pao.poll_id = ANY($2)
            ORDER BY pao.option_order;
        `;

        const optionsResult = await pool.query(optionsQuery, [userId, pollIds]);

        const pollsMap = {};
        pollsResult.rows.forEach(row => {
            pollsMap[row.id] = {
                id: row.id,
                question: row.question,
                options: [],
                endsIn: row.ends_in,
                isLiked: row.is_liked,
                user: {
                    userId: row.user_id,
                    username: row.username,
                    image: row.image,
                    followersNumber: row.followers_number < 0 ? 0 : row.followers_number,
                    isFollowing: row.is_following,
                    bio: row.user_bio
                }
            };
        });

        const optionsMap = {};
        optionsResult.rows.forEach(row => {
            if (!optionsMap[row.poll_id])
                optionsMap[row.poll_id] = [];

            optionsMap[row.poll_id].push({ id: row.id, text: row.text, voted: row.voted, votesCount: row.votesCount });
        });

        Object.keys(pollsMap).forEach(pollId => {
            const poll = pollsMap[pollId];
            poll.options = optionsMap[pollId] || [];
        });

        return Object.values(pollsMap);
    } catch (err) {
        console.error('Error fetching polls:', err);
        return [];
    }
};

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
const getPollOptions = async (pollId) => {
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
            VALUES ($1, $2, (SELECT NOW() + INTERVAL '${duration}'), $3)
            RETURNING id`,
            [createdBy, question, readableId]
        );

        const pollId = pollInserResult.rows[0].id;

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

module.exports = {
    createPoll,
    deletePoll,
    fetchPolls,
    getPollById,
    getPollOptions,
    likePoll,
    unlikePoll,
    voteOnPoll,
};
