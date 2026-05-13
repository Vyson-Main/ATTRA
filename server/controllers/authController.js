const UserModel = require('../models/User');
const { hash, compare } = require('../services/hashService');
const { signToken } = require('../services/jwtService');
const { query } = require('../config/db');

/**
 * POST /api/auth/login
 * For students: id = 10-digit student_id
 * For teachers: id = email
 */
async function login(req, res, next) {
  try {
    const { id, password, role } = req.body;

    // Validate student ID format server-side
    if (role === 'student') {
      if (!/^\d{10}$/.test(id)) {
        return res.status(422).json({ error: 'Student ID must be exactly 10 digits' });
      }
      const year = parseInt(id.slice(0, 4), 10);
      if (year < 2000 || year > 2099) {
        return res.status(422).json({ error: 'Invalid student ID format' });
      }
    }

    let user;
    if (role === 'student') {
      user = await UserModel.findByStudentId(id);
    } else {
      user = await UserModel.findByEmail(id);
    }

    if (!user || user.role !== role) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({
      id: user.id,
      studentId: user.student_id,
      role: user.role,
      name: user.name,
    });

    res.json({
      token,
      user: {
        id:        user.id,
        studentId: user.student_id,
        name:      user.name,
        nickname:  user.nickname || null,
        email:     user.email,
        role:      user.role,
        section:   user.section,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/register  (teachers only)
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await hash(password);
    const user = await UserModel.createTeacher({ name, email, passwordHash });
    const token = signToken({ id: user.id, role: 'teacher', name: user.name });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 */
async function me(req, res, next) {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id:        user.id,
      studentId: user.student_id,
      name:      user.name,
      nickname:  user.nickname || null,
      email:     user.email,
      role:      user.role,
      section:   user.section,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/auth/profile
 */
async function updateProfile(req, res, next) {
  try {
    const { name, nickname } = req.body;
    if (!name || !name.trim()) return res.status(422).json({ error: 'Name is required' });
    const { rows } = await query(
      `UPDATE users
         SET name = $1, nickname = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, nickname, email, role, student_id, section`,
      [name.trim(), (nickname || '').trim() || null, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/change-password
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(422).json({ error: 'All fields required' });
    if (newPassword.length < 6)
      return res.status(422).json({ error: 'Password must be at least 6 characters' });

    const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const newHash = await hash(newPassword);
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, user.id]
    );
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, me, updateProfile, changePassword };
