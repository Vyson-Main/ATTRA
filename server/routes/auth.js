const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { login, register, me, updateProfile, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authenticate');
const { validate } = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post(
  '/login',
  authLimiter,
  [
    body('id').trim().notEmpty().withMessage('ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher'),
  ],
  validate,
  login
);

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.get('/me', authenticate, me);

router.patch(
  '/profile',
  authenticate,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validate,
  updateProfile
);

router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;
