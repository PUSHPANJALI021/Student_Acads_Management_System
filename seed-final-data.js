const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function seedFinalData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🚀 Seeding Grades, Attendance, and Timetable...');

    // 1. Add Grades
    console.log('📈 Adding grades...');
    const [enrollments] = await connection.query('SELECT enrollment_id FROM enrollments');
    for (const e of enrollments) {
      const internal = Math.floor(Math.random() * 20) + 20; // 20-40
      const external = Math.floor(Math.random() * 30) + 30; // 30-60
      await connection.query(
        'INSERT IGNORE INTO grades (enrollment_id, internal_marks, external_marks) VALUES (?, ?, ?)',
        [e.enrollment_id, internal, external]
      );
    }

    // 2. Add Attendance
    console.log('📅 Adding attendance records...');
    const [enrollmentsWithIds] = await connection.query('SELECT student_id, course_id FROM enrollments');
    const dates = ['2024-05-01', '2024-05-02', '2024-05-03'];
    for (const e of enrollmentsWithIds) {
      for (const d of dates) {
        await connection.query(
          'INSERT IGNORE INTO attendance (student_id, course_id, date, status, marked_by) VALUES (?, ?, ?, ?, ?)',
          [e.student_id, e.course_id, d, Math.random() > 0.2 ? 'Present' : 'Absent', 1]
        );
      }
    }

    // 3. Add Timetable
    console.log('📅 Creating timetable...');
    const [courses] = await connection.query('SELECT course_id FROM courses');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let dayIdx = 0;
    for (const c of courses) {
      await connection.query(
        'INSERT IGNORE INTO timetable (course_id, day, start_time, end_time, room) VALUES (?, ?, ?, ?, ?)',
        [c.course_id, days[dayIdx % 5], '09:00:00', '10:00:00', 'LH-' + (dayIdx + 101)]
      );
      dayIdx++;
    }

    // 4. Add Announcements
    console.log('📢 Posting announcements...');
    await connection.query(
      'INSERT IGNORE INTO announcements (title, body, posted_by, target_role) VALUES (?, ?, ?, ?)',
      ['Final Exam Schedule', 'The final exams will start from June 1st. Please check your timetable.', 1, 'all']
    );
    await connection.query(
      'INSERT IGNORE INTO announcements (title, body, posted_by, target_role) VALUES (?, ?, ?, ?)',
      ['New Course Materials', 'New PDF notes have been uploaded for DBMS in the resources section.', 1, 'student']
    );

    console.log('✅ Final data seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await connection.end();
  }
}

seedFinalData();
