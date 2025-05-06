const {publishPollEvents} = require("../db/dal/pollQueries");

const run_interval = 5000;

/**
 * The job which monitors polls freshness and posts to events_queue to update index
 * @returns {Promise<void>}
 */
const job = async function() {
    await publishPollEvents();
}

let runFinished = false;

setInterval(async () => {
    try {
        if (!runFinished)
            return;

        runFinished = false;
        await job();
        runFinished = true;
    } catch (e) {
        console.error(e);
    }
}, run_interval);

console.info('Poll monitor job is running...');