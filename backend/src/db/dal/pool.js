const {Pool} = require("pg");
const types = require('pg').types;

// Disable automatic parsing of `timestamp` and `timestamptz`
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;

types.setTypeParser(TIMESTAMPTZ_OID, str => str); // return as-is string
types.setTypeParser(TIMESTAMP_OID, str => str);

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