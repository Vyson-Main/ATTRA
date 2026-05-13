const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_production';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Sign a JWT token.
 * @param {object} payload  { id, role }
 */
function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns decoded payload or throws
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

/**
 * Extract token from Authorization header.
 * @param {string} authHeader  e.g. "Bearer eyJ..."
 */
function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

module.exports = { signToken, verifyToken, extractToken };
