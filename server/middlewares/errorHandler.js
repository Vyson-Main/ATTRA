/**
 * Global Express error handler.
 * Catches anything passed to next(err).
 */
function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `File too large. Maximum size is ${process.env.UPLOAD_MAX_SIZE_MB || 10}MB` });
  }
  if (err.message && err.message.includes('Only CSV')) {
    return res.status(400).json({ error: err.message });
  }

  // JWT errors (shouldn't reach here normally, but just in case)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Duplicate entry', detail: err.detail });
  }

  // Default
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
