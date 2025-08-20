const {pool} = require("../db/dal/pool");

const CATEGORIES = {
    SOCIAL_LIFE: 1,
    HEALTH: 2,
    ENTERTAINMENT: 3,
    FOOD: 4,
    LIFESTYLE: 5,
    FASHION: 6,
    TECH: 7,
    OPINIONS: 8,
    MEDIA: 9,
    GAMES: 10
}


async function categorizePolls() {
    const getPollQuery = `
        SELECT id, question FROM polls
            WHERE status = 1
        ORDER BY created_at ASC
        LIMIT 1;
    `;

    const pollsQuery = await pool.query(getPollQuery);
    if (pollsQuery.rows?.length === 0 ?? true)
        return;

    const {id, question} = pollsQuery.rows[0];

    try {
        const url = `http://localhost:3033/classify?q=${encodeURIComponent(question)}`;

        const res = await fetch(url, {
            headers: { Accept: "application/json, text/plain;q=0.9, */*;q=0.8" },
        });

        const raw = await res.text();

        const category = CATEGORIES[raw.toUpperCase()];

        const updateQuery = `
            UPDATE polls SET 
                category_id = $1,
                status = 0 -- ready for feed
            WHERE id = $2
        `;

        await pool.query(updateQuery, [category, id]);

        console.log('assigned ' + raw + ' category to poll ' + id);
    } catch (e) {
        console.log(e + 'assigning default category to poll ' + id);

        const updateQuery = `
            UPDATE polls SET 
                category_id = (SELECT id FROM categories WHERE name = 'Other'),
                status = 0 -- ready for feed
            WHERE id = $1
        `;

        await pool.query(updateQuery, [id]);
    }

}

module.exports = {
    categorizePolls
}