const {pool} = require("./pool");

/**
 * Inserts notifications for users who received new followers
 * since their last notification (or never received one),
 * respecting local time and minimum delay.
 *
 * @returns {Promise<number>} number of inserted rows
 */
async function insertNewFollowNotifications() {
    const query = `
        WITH inserted AS (
            INSERT INTO notifications (
                                       user_id,
                                       notification_tag,
                                       message_title,
                                       message_body,
                                       message_data
                )
                SELECT
                    u.id AS user_id,
                    0 AS notification_tag,
                    'New followers!' AS message_title,
                    FORMAT(
                            'You''ve got %s new follower%s since yesterday.',
                            COUNT(f.*),
                            CASE WHEN COUNT(f.*) = 1 THEN '' ELSE 's' END
                    ) AS message_body,
                    '{ "screenName": "Notifications" }' AS message_data
                FROM users u
                         JOIN user_follows f ON f.user_follow_id = u.id
                         LEFT JOIN notifications n
                                   ON n.user_id = u.id
                                       AND n.notification_tag = 0
                WHERE (
                    n.created_at IS NULL
                        OR n.created_at < NOW() AT TIME ZONE 'UTC' - INTERVAL '22 hours'
                    )
                  AND u.is_new_followers_notification_enabled = true
                  AND f.created_at > COALESCE(
                        (
                            SELECT MAX(n2.created_at)
                            FROM notifications n2
                            WHERE n2.user_id = u.id AND n2.notification_tag = 0
                        ),
                        TIMESTAMP '2000-01-01'
                                     )
                  AND (
                    (NOW() AT TIME ZONE 'UTC' + (u.timezone_offset || ' hours')::INTERVAL)::TIME
                        BETWEEN TIME '09:00' AND TIME '21:00')
                GROUP BY u.id
                RETURNING 1
        )
        SELECT COUNT(*) AS inserted_count FROM inserted;
    `;

    try {
        const { rows } = await pool.query(query);
        const result= parseInt(rows[0].inserted_count, 10);
        if (result > 0) {
            console.log(`Created ${result} "new followers" notifications`);
        }
    } catch (error) {
        console.error('Error inserting "new followers" notifications:', error);
        throw error;
    }
}


async function getUserNotifications(userId) {
    const query = `
    SELECT id, message_body, created_at, is_viewed
    FROM notifications
    WHERE user_id = $1
      AND is_deleted = false
    ORDER BY created_at DESC
    LIMIT 100;
  `;

    try {
        const { rows } = await pool.query(query, [userId]);

        return rows.map(row => ({
            id: row.id,
            message: row.message_body,
            createdAt: new Date(row.created_at.replace(' ', 'T') + 'Z').toISOString(),
            isViewed: row.is_viewed
        }));
    } catch (err) {
        console.error('Error fetching notifications:', err);
        return [];
    }
}

async function deleteAllUserNotifications(userId) {
    const query = `
    UPDATE notifications
    SET is_deleted = true
    WHERE user_id = $1
  `;

    try {
        await pool.query(query, [userId]);
        console.log(`All notifications marked as deleted for user: ${userId}`);
    } catch (error) {
        console.error('Error deleting notifications:', error);
        throw error;
    }
}

async function markNotificationsAsRead(userId, notificationIds) {
    const query = `
    UPDATE notifications
    SET is_viewed = true
    WHERE user_id = $1::uuid
      AND id = ANY($2::uuid[])
  `;

    try {
        await pool.query(query, [userId, notificationIds]);
        console.log(`Notifications marked as read for user: ${userId}`);
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        throw error;
    }
}

module.exports = {
    insertNewFollowNotifications,
    getUserNotifications,
    deleteAllUserNotifications,
    markNotificationsAsRead
};
