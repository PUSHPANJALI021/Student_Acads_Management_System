const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME, // Removed to allow creating DB if it doesn't exist
    multipleStatements: true, 
    ssl: process.env.DB_HOST === 'localhost' ? undefined : {
      rejectUnauthorized: false
    }
  });

  console.log('✅ Connected to Aiven MySQL!');

  try {
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('⏳ Running schema.sql...');
    await connection.query(schema);
    console.log('🎉 Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

initDb();
