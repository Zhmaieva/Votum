require('dotenv').config();

const {generateActivity} = require("../services/botService");
const {categorizePollsOpenAI} = require("../services/categorizationService");
const {sweepPollIndexUpdateEvents, sweepUserCategoryUpdateEvents} = require("../db/dal/eventQueries");
const {insertNewFollowNotifications} = require("../db/dal/notificationQueries");
const {sendPendingNotifications} = require("../services/notificationService");

const run_interval = 1000;
const run_interval_bot = 30000;

let is_processing = false;
let is_processing_bot = false;

/**
 * The job to process data
 * @returns {Promise<void>}
 */
const job = async function() {
    if (is_processing)
        return;
    is_processing = true;

    try {
        await categorizePollsOpenAI();
    } catch (ex) {
        console.log(ex);
    }

    try {
        await sweepPollIndexUpdateEvents(sweep_batch_size);
    } catch (ex) {
        console.log(ex);
    }

    try {
        await sweepUserCategoryUpdateEvents(sweep_batch_size);
    } catch (ex) {
        console.log(ex);
    }

    try {
        await insertNewFollowNotifications();
    } catch (ex) {
        console.log(ex);
    }

    try {
        await sendPendingNotifications();
    } catch (ex) {
        console.log(ex);
    }

    is_processing = false;
}


/**
 * The job to generate activity
 */
const botJob = async function() {
    if (is_processing_bot)
        return;
    is_processing_bot = true;

    try {
        await generateActivity();
    } catch (ex) {
        console.log(ex);
    }

    is_processing_bot = false;
}

setInterval(async () => {
    try {
        await job();
    } catch (e) {
        console.error(e);
    }
}, run_interval);

setInterval(async () => {
    try {
        await botJob();
    } catch (e) {
        console.error(e);
    }
}, run_interval_bot);

console.info('Universal job is running...');