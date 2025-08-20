require('dotenv').config();

const {categorizePolls} = require("../services/categorizationService");

const run_interval = 1000;

let is_processing = false;

/**
 * The job updates index based on sweeping events_queue table
 * @returns {Promise<void>}
 */
const job = async function() {
    if (is_processing)
        return;
    is_processing = true;

    try {
        await categorizePolls();
    } catch (ex) {
        console.log(ex);
    }

    is_processing = false;
}

setInterval(async () => {
    try {
        await job();
    } catch (e) {
        console.error(e);
    }
}, run_interval);

console.info('Categorization job is running...');