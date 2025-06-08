const fetch = require('node-fetch');
const {pool} = require("../db/dal/pool");

async function sendExpoPushNotification(expoPushToken, title, body, jsonData) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: jsonData,
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    await response.json();
}


async function sendPendingNotifications() {
    const client = await pool.connect();
    try {
        const { rows: notifications } = await client.query(`
            SELECT n.*, u.push_token
            FROM notifications n
            JOIN users u ON u.id = n.user_id
            WHERE n.state = 0
        `);

        for (const notification of notifications) {
            const { id, user_id, push_token, message_title, message_body, message_data } = notification;

            if (!push_token) {
                await client.query(
                    `UPDATE notifications SET state = 2, processed_at = NOW() AT TIME ZONE 'UTC' WHERE id = $1`,
                    [id]
                );
                continue;
            }

            try {
                await sendExpoPushNotification(push_token, message_title, message_body, JSON.parse(message_data));
                await client.query(
                    `UPDATE notifications SET state = 1, processed_at = NOW() AT TIME ZONE 'UTC' WHERE id = $1`,
                    [id]
                );
            } catch (err) {
                console.error(`Failed to send push to user ${user_id}:`, err);
                await client.query(
                    `UPDATE notifications SET state = 3, processed_at = NOW() AT TIME ZONE 'UTC' WHERE id = $1`,
                    [id]
                );
            }
        }
    } catch (err) {
        console.error('Error sending pending notifications:', err);
    } finally {
        client.release();
    }
}

module.exports = {
    sendExpoPushNotification,
    sendPendingNotifications
}