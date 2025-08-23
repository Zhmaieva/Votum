const {pool} = require("./pool");

async function addComment({pollId, userId, comment}) {
    const query = `
        INSERT INTO poll_comments (poll_id, user_id, text) 
        VALUES ($1, $2, $3); 
    `;

    await pool.query(query, [pollId, userId, comment]);

    return {}
}

async function getComments({pollId}) {
    const query = `
        SELECT
            c.id,
            c.text,
            u.id as userId,
            u.username,
            up.image,
            c.created_at
        FROM poll_comments c
        JOIN users u ON u.id = c.user_id
        JOIN user_profiles up on up.user_id = c.user_id
        WHERE c.poll_id = $1
        ORDER BY c.created_at DESC
        LIMIT 100;
    `;

    const queryResult = await pool.query(query, [pollId]);
    if (queryResult?.rows?.length > 0)
        return queryResult.rows;

    return [];
}

module.exports = {
    addComment,
    getComments
}