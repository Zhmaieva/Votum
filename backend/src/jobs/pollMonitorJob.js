const {publishPollEvents} = require("../db/dal/pollQueries");

const run_interval = 5000;

/**
 * The job which monitors polls freshness and posts to events_queue to update index
 * @returns {Promise<void>}
 */
const job = async function() {
    await publishPollEvents();
}

setInterval(async () => {
    try {
        await job();
    } catch (e) {
        console.error(e);
    }
}, run_interval);

console.info('Poll monitor job is running...');