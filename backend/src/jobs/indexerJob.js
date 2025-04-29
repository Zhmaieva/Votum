const {sweepPollIndexUpdateEvents, sweepPollDeleteEvents} = require ("../db/dal/eventQueries");

const run_interval = 5000;
const sweep_batch_size = 10;

/**
 * The job updates index based on sweeping events_queue table
 * @returns {Promise<void>}
 */
const job = async function() {
    await sweepPollIndexUpdateEvents(sweep_batch_size);
    await sweepPollDeleteEvents(sweep_batch_size);
}

setInterval(async () => {
    try {
        await job();
    } catch (e) {
        console.error(e);
    }
}, run_interval);

console.info('Indexer job is running...');