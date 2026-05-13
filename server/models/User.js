const { query } = require('../config/db');

const UserModel = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async findByStudentId(studentId) {
    const { rows } = await query('SELECT * FROM users WHERE student_id = $1 AND role = $2', [studentId, 'student']);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    return rows[0] || null;
  },

  async createTeacher({ name, email, passwordHash }) {
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'teacher')
       RETURNING id, name, email, role, created_at`,
      [name, email.toLowerCase(), passwordHash]
    );
    return rows[0];
  },

  async createStudent({ studentId, name, section, passwordHash }) {
    const { rows } = await query(
      `INSERT INTO users (student_id, name, section, password_hash, role)
       VALUES ($1, $2, $3, $4, 'student')
       ON CONFLICT (student_id) DO UPDATE
         SET name = EXCLUDED.name, section = EXCLUDED.section
       RETURNING id, student_id, name, section, role`,
      [studentId, name, section || null, passwordHash]
    );
    return rows[0];
  },
};

module.exports = UserModel;
