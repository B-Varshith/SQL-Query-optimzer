const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user : "postgres",
  host : "localhost",
  database : "varshith",
  password : "varshith@123",
  port : 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};