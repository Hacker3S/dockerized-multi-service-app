const { Pool } = require('pg');

// Connection details come from environment variables set in docker-compose.yml.
// Defaults here only matter for running the backend outside Docker.
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'appdb',
});

module.exports = pool;
