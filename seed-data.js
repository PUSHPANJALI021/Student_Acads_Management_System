const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🌱 Seeding departments...');
    await connection.query(`
      INSERT IGNORE INTO departments (dept_name, dept_code) VALUES 
      ('Computer Science & Engineering', 'CSE'),
      ('Electronics & Communication', 'ECE'),
      ('Mechanical Engineering', 'MECH'),
      ('Civil Engineering', 'CIVIL'),
      ('Information Technology', 'IT')
    `);
    console.log('✅ Departments seeded successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

seed();
