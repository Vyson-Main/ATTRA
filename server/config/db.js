require('dotenv').config();
console.log("DB URL USED:", process.env.DATABASE_URL);

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL connected:', result.rows[0].now);
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.error('   Make sure DATABASE_URL is set in server/.env');
    process.exit(1);
  }
}

/**
 * Execute a query with optional parameters.
 * @param {string} text  SQL query string
 * @param {Array}  params  Parameterized values
 */
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - start;
    console.log('  SQL:', { text: text.slice(0, 80), rows: res.rowCount, duration: `${duration}ms` });
  }
  return res;
}

/** Begin a transaction and return a client. */
async function transaction() {
  const client = await pool.connect();
  await client.query('BEGIN');
  return {
    query: (text, params) => client.query(text, params),
    commit: async () => { await client.query('COMMIT'); client.release(); },
    rollback: async () => { await client.query('ROLLBACK'); client.release(); },
  };
}

module.exports = { pool, query, transaction, testConnection };
