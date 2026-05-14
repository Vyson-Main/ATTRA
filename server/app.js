const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const studentRoutes = require('./routes/students');
const uploadRoutes = require('./routes/upload');
const exportRoutes = require('./routes/export');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ── CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: true,
  credentials: true,
}));

// ── Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);

// ── 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler
app.use(errorHandler);

module.exports = app;
