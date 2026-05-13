require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
  const client = await pool.connect();
  try {
    console.log('🔄 Running migrations...');
    await client.query(sql);
    console.log('✅ Migrations complete');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
