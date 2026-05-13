const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/studentController');
const { authenticate, authorize } = require('../middlewares/authenticate');

router.get('/', authenticate, authorize('teacher'), ctrl.getAll);
router.get('/:id', authenticate, authorize('teacher'), ctrl.getOne);

module.exports = router;
