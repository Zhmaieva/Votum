const { pool } = require('./pool'); // Assuming you have your db connection setup
const { recalculatePollsScore, recalculateUserFeedScores} = require('./pollQueries');
const {recalculateCategoryScore} = require("./userQueries"); // Your existing function

async function sweepPollIndexUpdateEvents(sweepSize) {
    try {
        // 1. Fetch top {sweepSize} oldest poll_index_update events
        const { rows } = await pool.query(`
            DELETE FROM events_queue
            WHERE ctid IN (
                SELECT ctid
                FROM events_queue
                WHERE event_name = 'poll_index_update'
                ORDER BY created_at ASC
                LIMIT $1
            )
            RETURNING entity_id, event_date
        `, [sweepSize]);

        const ids = rows.map((row) => row.entity_id);
        if (ids.length === 0) return;

        await recalculatePollsScore({ pollIds: ids});

        if (rows.length > 0) {
            console.log(`Successfully processed ${rows.length} poll_index_update events.`);
        }
    } catch (error) {
        console.error('Error sweeping poll index update events:', error);
        throw error;
    }
}

async function sweepUserCategoryUpdateEvents(sweepSize) {
    try {
        // 1. Fetch and delete up to {sweepSize} oldest user_category_update events
        const { rows } = await pool.query(`
      DELETE FROM events_queue
      WHERE ctid IN (
        SELECT ctid
        FROM events_queue
        WHERE event_name = 'user_category_update'
        ORDER BY created_at ASC
        LIMIT $1
      )
      RETURNING entity_id, metadata
    `, [sweepSize]);

        if (rows.length === 0) return;

        // 2. Build userCategoryPair array: [userId, categoryId]
        const userCategoryPair = rows.map(row => [
            row.entity_id,
            parseInt(row.metadata, 10)
        ]);

        await recalculateCategoryScore({ userCategoryPair });

        console.log(`Successfully processed ${rows.length} user_category_update events.`);
    } catch (error) {
        console.error('Error sweeping user_category_update events:', error);
        throw error;
    }
}


module.exports = {
    sweepPollIndexUpdateEvents,
    sweepUserCategoryUpdateEvents,
}