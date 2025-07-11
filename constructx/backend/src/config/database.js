const { Pool } = require('pg');

const pool = new Pool({
  user: 'constructx_user',
  host: 'localhost',
  database: 'constructx',
  password: 'constructx_password',
  port: 5432,
});

module.exports = pool;

