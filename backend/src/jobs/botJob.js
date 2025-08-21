require('dotenv').config();

const {generateActivity} = require("../services/botService");

const run_interval = 1000;

let is_processing = false;

/**
 * The job generate some bot activity
 * @returns {Promise<void>}
 */
const job = async function() {
    if (is_processing)
        return;
    is_processing = true;

    try {
        await generateActivity();
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

console.info('Bot job is running...');