const { query } = require('../config/db');

const AttendanceModel = {
  /**
   * Get today's attendance joined with all students.
   * Returns one row per student (PRESENT or ABSENT).
   */
  async getTodayList(date) {
    const { rows } = await query(
      `SELECT
         s.student_id,
         s.name,
         s.section,
         COALESCE(a.status, 'ABSENT') AS status,
         a.time_in,
         a.time_out,
         a.duration,
         a.id AS record_id
       FROM students s
       LEFT JOIN attendance a
         ON a.student_id = s.student_id AND a.date = $1
       ORDER BY s.name ASC`,
      [date]
    );
    return rows;
  },

  /**
   * Find today's record for a specific student.
   */
  async findTodayRecord(studentId, date) {
    const { rows } = await query(
      'SELECT * FROM attendance WHERE student_id = $1 AND date = $2',
      [studentId, date]
    );
    return rows[0] || null;
  },

  /**
   * Insert a PRESENT record (time-in).
   */
  async markPresent(studentId, date, timeIn) {
    const { rows } = await query(
      `INSERT INTO attendance (student_id, date, time_in, status)
       VALUES ($1, $2, $3, 'PRESENT')
       RETURNING *`,
      [studentId, date, timeIn]
    );
    return rows[0];
  },

  /**
   * Update record with time-out and computed duration.
   */
  async markLeave(recordId, timeOut, duration) {
    const { rows } = await query(
      `UPDATE attendance
       SET time_out = $1, duration = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [timeOut, duration, recordId]
    );
    return rows[0] || null;
  },

  /**
   * Full history for a student.
   */
  async getStudentHistory(studentId) {
    const { rows } = await query(
      'SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC, time_in DESC',
      [studentId]
    );
    return rows;
  },

  /**
   * Attendance for a specific date (for export).
   */
  async getByDate(date) {
    const { rows } = await query(
      `SELECT
         s.student_id,
         s.name,
         s.section,
         COALESCE(a.status, 'ABSENT') AS status,
         a.time_in,
         a.time_out,
         a.duration
       FROM students s
       LEFT JOIN attendance a ON a.student_id = s.student_id AND a.date = $1
       ORDER BY s.name ASC`,
      [date]
    );
    return rows;
  },

  /**
   * Summary stats for a given date.
   */
  async getStats(date) {
    const { rows } = await query(
      `SELECT
         COUNT(DISTINCT s.student_id) AS total,
         COUNT(a.id) FILTER (WHERE a.status = 'PRESENT') AS present
       FROM students s
       LEFT JOIN attendance a ON a.student_id = s.student_id AND a.date = $1`,
      [date]
    );
    const total = parseInt(rows[0].total, 10);
    const present = parseInt(rows[0].present, 10);
    return { total, present, absent: total - present, rate: total ? Math.round((present / total) * 100) : 0 };
  },
};

module.exports = AttendanceModel;
