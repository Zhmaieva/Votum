const { pool } = require('./pool'); // Assuming you have your db connection setup
const { recalculatePollScore, recalculateUserFeedScores} = require('./pollQueries'); // Your existing function

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
            RETURNING entity_id, created_at
        `, [sweepSize]);

        // 2. For each event, call recalculatePollScore
        const promises = rows.map(row =>
            recalculatePollScore({
                pollId: row.entity_id,
                updatedOn: row.created_at,
            })
        );

        // 3. Wait for all recalculations to finish
        await Promise.all(promises);

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

async function sweepUserIndexUpdateEvents(sweepSize) {
    const client = await pool.connect();
    try {
        // 1. Fetch top {sweepSize} oldest poll_index_update events
        const { rows } = await client.query(`
            DELETE FROM events_queue
            WHERE ctid IN (
                SELECT ctid
                FROM events_queue
                WHERE event_name = 'user_index_update'
                ORDER BY created_at ASC
                LIMIT $1
            )
            RETURNING entity_id, created_at
        `, [sweepSize]);

        // 2. For each event, call recalculatePollScore
        const promises = rows.map(row =>
            recalculateUserFeedScores({
                userId: row.entity_id,
                updatedOn: row.created_at,
            })
        );

        // 3. Wait for all recalculations to finish
        await Promise.all(promises);

        if (rows.length > 0) {
            console.log(`Successfully processed ${rows.length} user_index_update events.`);
        }
    } catch (error) {
        console.error('Error sweeping poll index update events:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function sweepPollDeleteEvents(sweepSize) {
    const client = await pool.connect();
    try {
        // 1. Fetch and immediately delete the events, returning poll IDs
        const { rows } = await client.query(`
            DELETE FROM events_queue
            WHERE ctid IN (
                SELECT ctid
                FROM events_queue
                WHERE event_name = 'poll_index_delete'
                ORDER BY created_at ASC
                LIMIT $1
            )
            RETURNING entity_id
        `, [sweepSize]);

        const pollIds = rows.map(row => row.entity_id);

        // 2. Delete all user_polls matching these poll IDs
        const deleteResult = await client.query(`
          DELETE FROM user_polls
          WHERE poll_id = ANY($1::uuid[])
        `, [pollIds]);

        if (deleteResult?.rowCount > 0)
            console.log(`Deleted ${deleteResult.rowCount} user_polls for a poll`);

        return deleteResult.rowCount; // number of user_polls rows deleted
    } catch (error) {
        console.error('Error sweeping poll delete events:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function sweepUserDeleteEvents(sweepSize) {
    const client = await pool.connect();
    try {
        // 1. Fetch and immediately delete the events, returning poll IDs
        const { rows } = await client.query(`
            DELETE FROM events_queue
            WHERE ctid IN (
                SELECT ctid
                FROM events_queue
                WHERE event_name = 'user_index_delete'
                ORDER BY created_at ASC
                LIMIT $1
            )
            RETURNING entity_id
        `, [sweepSize]);

        const pollIds = rows.map(row => row.entity_id);

        // 2. Delete all user_polls matching these poll IDs
        const deleteResult = await client.query(`
          DELETE FROM user_polls
          WHERE poll_id = ANY($1::uuid[])
        `, [pollIds]);

        if (deleteResult?.rowCount > 0)
            console.log(`Deleted ${deleteResult.rowCount} user_polls for a user`);

        return deleteResult.rowCount; // number of user_polls rows deleted
    } catch (error) {
        console.error('Error sweeping poll delete events:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    sweepPollDeleteEvents,
    sweepPollIndexUpdateEvents,
    sweepUserDeleteEvents,
    sweepUserIndexUpdateEvents
}