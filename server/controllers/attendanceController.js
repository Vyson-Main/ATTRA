const AttendanceModel = require('../models/Attendance');

function today() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function calcDuration(timeIn, timeOut) {
  try {
    const parse = t => new Date(`1970/01/01 ${t}`);
    const diff = (parse(timeOut) - parse(timeIn)) / 60000;
    if (isNaN(diff) || diff < 0) return null;
    return `${Math.floor(diff / 60)}h ${Math.round(diff % 60)}m`;
  } catch {
    return null;
  }
}

/**
 * POST /api/attendance/present
 * Student marks themselves present.
 */
async function markPresent(req, res, next) {
  try {
    const studentId = req.user.studentId;
    const date = today();

    const existing = await AttendanceModel.findTodayRecord(studentId, date);
    if (existing) {
      return res.status(409).json({ error: 'Attendance already recorded for today', record: existing });
    }

    const record = await AttendanceModel.markPresent(studentId, date, nowTime());
    res.status(201).json({ message: 'Attendance recorded', record });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/attendance/leave
 * Student marks time-out and triggers logout on client.
 */
async function markLeave(req, res, next) {
  try {
    const studentId = req.user.studentId;
    const date = today();

    const record = await AttendanceModel.findTodayRecord(studentId, date);
    if (!record) {
      return res.status(404).json({ error: 'No attendance record found for today' });
    }
    if (record.time_out) {
      return res.status(409).json({ error: 'Leave already recorded' });
    }

    const timeOut = nowTime();
    const duration = calcDuration(record.time_in, timeOut);
    const updated = await AttendanceModel.markLeave(record.id, timeOut, duration);

    res.json({ message: 'Time-out recorded', record: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/attendance/today
 * Teacher gets full today list.
 */
async function getTodayList(req, res, next) {
  try {
    const date = req.query.date || today();
    const rows = await AttendanceModel.getTodayList(date);
    res.json({ date, rows });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/attendance/stats
 */
async function getStats(req, res, next) {
  try {
    const date = req.query.date || today();
    const stats = await AttendanceModel.getStats(date);
    res.json({ date, ...stats });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/attendance/student/:studentId
 * Teacher or student gets history.
 */
async function getStudentHistory(req, res, next) {
  try {
    const { studentId } = req.params;
    // Students can only view their own history
    if (req.user.role === 'student' && req.user.studentId !== studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const history = await AttendanceModel.getStudentHistory(studentId);
    res.json({ studentId, history });
  } catch (err) {
    next(err);
  }
}

module.exports = { markPresent, markLeave, getTodayList, getStats, getStudentHistory };
