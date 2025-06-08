const {insertNewFollowNotifications} = require("../db/dal/notificationQueries");
const {sendExpoPushNotification, sendPendingNotifications} = require("../services/notificationService");

const run_interval = 1000;

let is_processing = false;

/**
 * The job produces and sends notifications
 * @returns {Promise<void>}
 */
const job = async function() {
    if (is_processing)
        return;
    is_processing = true;

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

setInterval(async () => {
    try {
        await job();
    } catch (e) {
        console.error(e);
    }
}, run_interval);

console.info('Notification job is running...');