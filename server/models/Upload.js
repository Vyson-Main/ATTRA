const { query } = require('../config/db');

const UploadModel = {
  async create({ teacherId, filename, originalName, studentCount }) {
    const { rows } = await query(
      `INSERT INTO uploads (teacher_id, filename, original_name, student_count)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [teacherId, filename, originalName, studentCount]
    );
    return rows[0];
  },

  async findAll(teacherId) {
    const { rows } = await query(
      'SELECT * FROM uploads WHERE teacher_id = $1 ORDER BY created_at DESC',
      [teacherId]
    );
    return rows;
  },
};

module.exports = UploadModel;
