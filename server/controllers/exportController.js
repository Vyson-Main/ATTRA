const AttendanceModel = require('../models/Attendance');
const { buildExcel, buildPDF } = require('../services/exportService');

function today() {
  return new Date().toISOString().split('T')[0];
}

/**
 * GET /api/export/csv?date=YYYY-MM-DD
 */
async function exportExcel(req, res, next) {
  try {
    const date = req.query.date || today();
    const rows = await AttendanceModel.getByDate(date);
    const buffer = await buildExcel(rows, date);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_${date}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/export/pdf?date=YYYY-MM-DD
 */
async function exportPDF(req, res, next) {
  try {
    const date = req.query.date || today();
    const rows = await AttendanceModel.getByDate(date);
    const buffer = await buildPDF(rows, date);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_${date}.pdf"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

module.exports = { exportExcel, exportPDF };
