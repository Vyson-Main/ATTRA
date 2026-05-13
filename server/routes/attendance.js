const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middlewares/authenticate');

router.post('/present', authenticate, authorize('student'), ctrl.markPresent);
router.post('/leave', authenticate, authorize('student'), ctrl.markLeave);
router.get('/today', authenticate, authorize('teacher'), ctrl.getTodayList);
router.get('/stats', authenticate, authorize('teacher'), ctrl.getStats);
router.get('/student/:studentId', authenticate, ctrl.getStudentHistory);

module.exports = router;
