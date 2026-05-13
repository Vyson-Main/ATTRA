const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/uploadController');
const { authenticate, authorize } = require('../middlewares/authenticate');
const upload = require('../config/multer');

router.post('/classlist', authenticate, authorize('teacher'), upload.single('file'), ctrl.uploadClassList);
router.get('/history', authenticate, authorize('teacher'), ctrl.getUploadHistory);

module.exports = router;
