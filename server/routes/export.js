const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/exportController');
const { authenticate, authorize } = require('../middlewares/authenticate');

router.get('/excel', authenticate, authorize('teacher'), ctrl.exportExcel);
router.get('/pdf', authenticate, authorize('teacher'), ctrl.exportPDF);

module.exports = router;
