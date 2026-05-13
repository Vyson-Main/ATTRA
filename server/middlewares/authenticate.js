const { verifyToken, extractToken } = require('../services/jwtService');

/**
 * Middleware: verify JWT and attach user to req.user.
 */
function authenticate(req, res, next) {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired, please log in again' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware factory: restrict to specific roles.
 * @param {...string} roles  e.g. authorize('teacher')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
