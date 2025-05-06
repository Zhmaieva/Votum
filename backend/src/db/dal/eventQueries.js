const { pool } = require('./pool'); // Assuming you have your db connection setup
const { recalculatePollsScore, recalculateUserFeedScores} = require('./pollQueries'); // Your existing function

async function sweepPollIndexUpdateEvents(sweepSize) {
    const client = await pool.connect();
    try {
        // 1. Fetch top {sweepSize} oldest poll_index_update events
        const { rows } = await client.query(`
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

        const ids = rows.map((row) => row.id);
        await recalculatePollsScore(ids);

        if (rows.length > 0) {
            console.log(`Successfully processed ${rows.length} poll_index_update events.`);
        }
    } catch (error) {
        console.error('Error sweeping poll index update events:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    sweepPollIndexUpdateEvents,
}