const {pool} = require("./pool");

async function writeActivityReport(userId, description, report_type, related_entity_id = null) {
    const query = `
        INSERT INTO reported_activity (reporter_user_id, entity_id, description, report_type) 
        SELECT $1::uuid, $2::uuid, $3, $4
        WHERE EXISTS (
            SELECT 1 FROM users WHERE id = $1::uuid
        )
    `;
    await pool.query(query, [userId, related_entity_id, description, report_type]);
}

async function writeDebugLog(userId, log) {
    const query = `
        INSERT INTO user_logs (user_id, log)
        SELECT $1::uuid, $2
        WHERE EXISTS (
            SELECT 1 FROM users WHERE id = $1::uuid AND is_debug = true
        )
    `;
    await pool.query(query, [userId, log]);
}

module.exports = {
    writeActivityReport,
    writeDebugLog
}