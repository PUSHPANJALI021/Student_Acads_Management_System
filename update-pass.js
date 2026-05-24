const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function updatePassword() {
  const plaintext = 'Admin@123';
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(plaintext, salt);

  console.log('New Hash:', hash);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await connection.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, 'admin@sams.edu']);
    console.log('✅ Admin password updated in database!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

updatePassword();
