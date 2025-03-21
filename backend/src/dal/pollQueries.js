const {pool} = require("./pool");

const fetchPolls = async (userId) => {
    try {
        const pollsQuery = `
            SELECT p.id,
                   p.question,
                   p.votes_number,
                   p.ends_in,
                   u.username,
                   up.image,
                   up.followers_number,
                   CASE
                       WHEN pl.user_id IS NOT NULL THEN TRUE
                       ELSE FALSE
                       END AS is_liked
            FROM polls p
                     JOIN users u ON p.created_by = u.id
                     JOIN user_profiles up ON u.id = up.user_id
                     LEFT JOIN poll_likes pl ON p.id = pl.poll_id AND pl.user_id = $1
            WHERE p.ends_in > NOW();
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
                    userName: row.username,
                    image: row.image,
                    followersNumber: row.followers_number
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

module.exports = fetchPolls;
