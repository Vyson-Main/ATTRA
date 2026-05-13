const { query, transaction } = require('../config/db');

const StudentModel = {
  async findAll({ search, section } = {}) {
    let sql = 'SELECT id, student_id, name, section, email, created_at FROM students WHERE 1=1';
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (name ILIKE $${params.length} OR student_id ILIKE $${params.length})`;
    }
    if (section) {
      params.push(section);
      sql += ` AND section = $${params.length}`;
    }
    sql += ' ORDER BY name ASC';
    const { rows } = await query(sql, params);
    return rows;
  },

  async findById(studentId) {
    const { rows } = await query(
      'SELECT * FROM students WHERE student_id = $1',
      [studentId]
    );
    return rows[0] || null;
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) FROM students');
    return parseInt(rows[0].count, 10);
  },

  /**
   * Replace all students (used after class list upload).
   * Runs in a transaction: truncate → insert → update user accounts.
   */
  async replaceAll(students, defaultPasswordHash) {
    const tx = await transaction();
    try {
      await tx.query('TRUNCATE TABLE students RESTART IDENTITY CASCADE');

      for (const s of students) {
        await tx.query(
          `INSERT INTO students (student_id, name, section)
           VALUES ($1, $2, $3)
           ON CONFLICT (student_id) DO UPDATE SET name = EXCLUDED.name, section = EXCLUDED.section`,
          [s.student_id, s.name, s.section || null]
        );
        // Upsert corresponding user account
        await tx.query(
          `INSERT INTO users (student_id, name, section, password_hash, role)
           VALUES ($1, $2, $3, $4, 'student')
           ON CONFLICT (student_id) DO UPDATE
             SET name = EXCLUDED.name, section = EXCLUDED.section`,
          [s.student_id, s.name, s.section || null, defaultPasswordHash]
        );
      }

      await tx.commit();
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },
};

module.exports = StudentModel;
