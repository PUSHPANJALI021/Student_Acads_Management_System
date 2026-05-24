const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function verify() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@sams.edu']);
    if (rows.length > 0) {
      console.log('✅ User found in database');
    } else {
      console.log('❌ User NOT found in database. Inserting now...');
      await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['System Admin', 'admin@sams.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGNiGb6hgNbU5hZp3dqVkiKH2Oi', 'admin']
      );
      console.log('✅ User inserted successfully!');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

verify();
