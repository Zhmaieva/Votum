// Secret key for JWT from system environment variables
const SECRET_KEY = process.env.VOTE_APP_SECRET;
const MAIL_PASS = process.env.VOTE_APP_MAIL_PASS;

const EVENT_NAMES = {
    POLL_INDEX_UPDATE: 'poll_index_update',
    POLL_INDEX_DELETE: 'poll_index_delete',
    USER_INDEX_UPDATE: 'user_index_update',
    USER_INDEX_DELETE: 'user_index_delete',
}

module.exports = {
    SECRET_KEY,
    MAIL_PASS,
    EVENT_NAMES,
};