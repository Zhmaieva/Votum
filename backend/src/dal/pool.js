const {Pool} = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: "poll_app",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
});

module.exports = {
    pool
}