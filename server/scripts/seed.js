require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const TEACHER_PASS = 'Teacher123!';
const STUDENT_PASS = 'Student123!';

// 10-digit IDs: first 4 = year, remaining 6 = student number
const STUDENTS = [
  { id: '2023305573', name: 'Juan Dela Cruz',   section: 'BSCS-3A' },
  { id: '2023305574', name: 'Maria Reyes',       section: 'BSCS-3A' },
  { id: '2023305575', name: 'Carlo Mendoza',     section: 'BSCS-3A' },
  { id: '2023305576', name: 'Ana Gonzales',      section: 'BSCS-3A' },
  { id: '2023305577', name: 'Miguel Santos',     section: 'BSCS-3A' },
  { id: '2022201001', name: 'Liza Cruz',         section: 'BSCS-3A' },
  { id: '2022201002', name: 'Roberto Tan',       section: 'BSCS-3A' },
  { id: '2024100088', name: 'Sofia Villanueva',  section: 'BSCS-3A' },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding database...');
    const teacherHash = await bcrypt.hash(TEACHER_PASS, 12);
    const studentHash = await bcrypt.hash(STUDENT_PASS, 12);

    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'teacher')
       ON CONFLICT (email) DO NOTHING`,
      ['Ms. Santos', 'teacher@demo.com', teacherHash]
    );
    console.log('  ✓ Teacher: teacher@demo.com / Teacher123!');

    for (const s of STUDENTS) {
      await client.query(
        `INSERT INTO students (student_id, name, section)
         VALUES ($1, $2, $3)
         ON CONFLICT (student_id) DO NOTHING`,
        [s.id, s.name, s.section]
      );
      await client.query(
        `INSERT INTO users (student_id, name, section, password_hash, role)
         VALUES ($1, $2, $3, $4, 'student')
         ON CONFLICT (student_id) DO NOTHING`,
        [s.id, s.name, s.section, studentHash]
      );
    }
    console.log(`  ✓ ${STUDENTS.length} students (default password: Student123!)`);
    console.log('\n✅ Seed complete\n');
    console.log('Demo credentials:');
    console.log('  Teacher : teacher@demo.com / Teacher123!');
    console.log('  Students: e.g. 2023305573 / Student123!');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
