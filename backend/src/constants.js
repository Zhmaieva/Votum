// Secret key for JWT from system environment variables
const SECRET_KEY = process.env.VOTE_APP_SECRET;
const MAIL_PASS = process.env.VOTE_APP_MAIL_PASS;

module.exports = {
    SECRET_KEY,
    MAIL_PASS,
};