const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "shoes_db",
    password: "19120649",
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};