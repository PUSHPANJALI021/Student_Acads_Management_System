const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function seedDemoData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🚀 Starting demo data seeding...');

    const passHash = await bcrypt.hash('Password@123', 12);

    // 1. Create Users (Faculty and Students)
    console.log('👤 Creating users...');
    const users = [
      ['Dr. Alice Smith', 'alice@sams.edu', passHash, 'faculty'],
      ['Dr. Bob Johnson', 'bob@sams.edu', passHash, 'faculty'],
      ['Dr. Charlie Brown', 'charlie@sams.edu', passHash, 'faculty'],
      ['John Doe', 'john@sams.edu', passHash, 'student'],
      ['Jane Doe', 'jane@sams.edu', passHash, 'student'],
      ['Mike Ross', 'mike@sams.edu', passHash, 'student'],
      ['Rachel Zane', 'rachel@sams.edu', passHash, 'student'],
      ['Harvey Specter', 'harvey@sams.edu', passHash, 'student'],
    ];

    for (const u of users) {
      await connection.query('INSERT IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', u);
    }

    // Get User IDs
    const [userRows] = await connection.query('SELECT user_id, email, role FROM users');
    const userMap = {};
    userRows.forEach(row => userMap[row.email] = row.user_id);

    // 2. Create Faculty Details
    console.log('👨‍🏫 Creating faculty details...');
    const faculty = [
      [userMap['alice@sams.edu'], 'FAC001', 'CSE', 'Professor', 'Ph.D in AI', '9876543210'],
      [userMap['bob@sams.edu'], 'FAC002', 'ECE', 'Associate Professor', 'Ph.D in VLSI', '9876543211'],
      [userMap['charlie@sams.edu'], 'FAC003', 'MECH', 'Assistant Professor', 'M.Tech in Thermal', '9876543212'],
    ];
    for (const f of faculty) {
      await connection.query('INSERT IGNORE INTO faculty (faculty_id, employee_id, department, designation, qualification, phone) VALUES (?, ?, ?, ?, ?, ?)', f);
    }

    // 3. Create Student Details
    console.log('🎓 Creating student details...');
    const students = [
      [userMap['john@sams.edu'], 'RA21110030101', 'CSE', 3, 'A', '2003-05-15', '9999999990', 'New York'],
      [userMap['jane@sams.edu'], 'RA21110030102', 'CSE', 3, 'A', '2003-06-20', '9999999991', 'California'],
      [userMap['mike@sams.edu'], 'RA21110030103', 'IT', 2, 'B', '2004-02-10', '9999999992', 'Chicago'],
      [userMap['rachel@sams.edu'], 'RA21110030104', 'ECE', 4, 'C', '2002-11-25', '9999999993', 'Boston'],
      [userMap['harvey@sams.edu'], 'RA21110030105', 'CSE', 4, 'A', '2002-01-05', '9999999994', 'Manhattan'],
    ];
    for (const s of students) {
      await connection.query('INSERT IGNORE INTO students (student_id, roll_number, department, year, section, dob, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', s);
    }

    // 4. Create Departments (already seeded, but let's get IDs)
    const [deptRows] = await connection.query('SELECT dept_id, dept_code FROM departments');
    const deptMap = {};
    deptRows.forEach(row => deptMap[row.dept_code] = row.dept_id);

    // 5. Create Courses
    console.log('📚 Creating courses...');
    const courses = [
      ['CS101', 'Database Management Systems', 4, deptMap['CSE'], userMap['alice@sams.edu'], 4, 2],
      ['CS102', 'Artificial Intelligence', 3, deptMap['CSE'], userMap['alice@sams.edu'], 6, 3],
      ['EC201', 'Digital Electronics', 4, deptMap['ECE'], userMap['bob@sams.edu'], 3, 2],
      ['ME301', 'Thermodynamics', 4, deptMap['MECH'], userMap['charlie@sams.edu'], 5, 3],
    ];
    for (const c of courses) {
      await connection.query('INSERT IGNORE INTO courses (course_code, course_name, credits, dept_id, faculty_id, semester, year) VALUES (?, ?, ?, ?, ?, ?, ?)', c);
    }

    // 6. Create Enrollments
    console.log('📝 Enrolling students...');
    const [courseRows] = await connection.query('SELECT course_id FROM courses');
    const courseIds = courseRows.map(r => r.course_id);
    const studentIds = [userMap['john@sams.edu'], userMap['jane@sams.edu'], userMap['mike@sams.edu']];

    for (const sid of studentIds) {
      for (const cid of courseIds) {
        await connection.query('INSERT IGNORE INTO enrollments (student_id, course_id, academic_year, semester) VALUES (?, ?, ?, ?)', [sid, cid, '2023-24', 4]);
      }
    }

    console.log('✅ Demo data seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await connection.end();
  }
}

seedDemoData();
