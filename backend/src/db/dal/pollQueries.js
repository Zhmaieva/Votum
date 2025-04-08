const {pool} = require("./pool");

const fetchPolls = async (userId) => {
    try {
        const pollsQuery = `
            SELECT p.id,
                   p.question,
                   p.votes_number,
                   p.ends_in,
                   u.username,
                   up.user_id,
                   up.image,
                   up.followers_number,
                   CASE
                       WHEN pl.user_id IS NOT NULL THEN TRUE
                       ELSE FALSE
                       END AS is_liked,
                   CASE
                       WHEN uf.user_follower_id IS NOT NULL THEN TRUE
                       ELSE FALSE
                       END AS is_following,
                   CASE 
                       WHEN p.created_by = $1 THEN up.bio
                       ELSE ''
                       END AS user_bio
            FROM polls p
                     JOIN users u ON p.created_by = u.id
                     JOIN user_profiles up ON u.id = up.user_id
                     LEFT JOIN poll_likes pl ON p.id = pl.poll_id AND pl.user_id = $1
                     LEFT JOIN user_follows uf ON u.id = uf.user_follow_id AND uf.user_follower_id = $1
            WHERE p.ends_in > NOW() AND p.is_deleted = false;
        `;

        const optionsQuery = `
            SELECT pao.poll_id, pao.text 
            FROM poll_answer_options pao;
        `;

        const [pollsResult, optionsResult] = await Promise.all([
            pool.query(pollsQuery, [userId]),
            pool.query(optionsQuery)
        ]);

        const pollsMap = {};
        pollsResult.rows.forEach(row => {
            pollsMap[row.id] = {
                id: row.id,
                question: row.question,
                options: [],
                results: {},
                endsIn: row.ends_in,
                totalVotes: row.votes_number,
                isLiked: row.is_liked,
                user: {
                    userId: row.user_id,
                    username: row.username,
                    image: row.image,
                    followersNumber: row.followers_number,
                    isFollowing: row.is_following,
                    bio: row.user_bio
                }
            };
        });

        const optionsMap = {};
        optionsResult.rows.forEach(row => {
            if (!optionsMap[row.poll_id]) optionsMap[row.poll_id] = [];
            optionsMap[row.poll_id].push(row.text);
        });

        Object.keys(pollsMap).forEach(pollId => {
            const poll = pollsMap[pollId];
            poll.options = optionsMap[pollId] || [];
            poll.results = generateRandomResults(poll.options);
        });

        return Object.values(pollsMap);
    } catch (err) {
        console.error('Error fetching polls:', err);
        return [];
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

const generateRandomResults = (options) => {
    let remainingPercentage = 100;
    const results = {};
    for (let i = 0; i < options.length; i++) {
        if (i === options.length - 1) {
            results[options[i]] = remainingPercentage;
        } else {
            const randomValue = Math.floor(Math.random() * (remainingPercentage - (options.length - i - 1))) + 1;
            results[options[i]] = randomValue;
            remainingPercentage -= randomValue;
        }
    }
    return results;
};

module.exports = {
    fetchPolls,
    likePoll,
    unlikePoll,
    deletePoll
};
