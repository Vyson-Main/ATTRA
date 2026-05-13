# AttendTrack — Classroom Attendance Monitoring System

A full-stack, role-based attendance system for teachers and students.

## Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS + React Router v6
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via `pg`) with raw SQL migrations
- **Auth**: JWT + bcrypt
- **File Upload**: Multer + xlsx/csv-parse
- **Export**: exceljs + pdfkit

---

## Project Structure
```
attendtrack/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── auth/        # LoginForm, RegisterForm
│       │   ├── dashboard/   # Sidebar, Topbar, StatCard
│       │   ├── student/     # StudentDashboard, AttendanceButtons
│       │   ├── teacher/     # TeacherDashboard, AttendanceTable
│       │   └── shared/      # Toast, Modal, Spinner, Badge
│       ├── pages/           # Route-level pages
│       ├── services/        # API call wrappers
│       ├── hooks/           # useAuth, useAttendance, useToast
│       ├── layouts/         # AuthLayout, DashboardLayout
│       └── utils/           # formatters, validators, exporters
├── server/                  # Express backend
│   ├── controllers/         # authController, attendanceController, uploadController
│   ├── routes/              # auth, attendance, students, upload, export
│   ├── models/              # User, Student, Attendance, Session, Upload
│   ├── middlewares/         # authenticate, authorize, validate, errorHandler
│   ├── services/            # jwtService, hashService, fileParser, exportService
│   ├── config/              # db.js, env.js, multer.js
│   └── uploads/             # Uploaded files directory
└── database/
    ├── migrations/          # SQL schema files
    └── seeds/               # Demo data
```

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 2. Environment Setup

```bash
# Copy env files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/attendtrack
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=8h
NODE_ENV=development
```

Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
# Create database
createdb attendtrack

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 4. Install & Run

```bash
npm run install:all
npm run dev
```

Visit: http://localhost:5173

---

## Demo Credentials

| Role    | ID/Email            | Password    |
|---------|---------------------|-------------|
| Teacher | teacher@demo.com    | Teacher123! |
| Student | S2401               | Student123! |
| Student | S2402               | Student123! |

---

## Features

### Student Portal
- Login with Student ID + password
- Real-time clock display
- Mark **Present** (records time-in)
- Mark **Leave** (records time-out, auto-logout)
- Session timeout after 30 minutes of inactivity
- Duplicate submission prevention

### Teacher Portal
- Register / Login
- Upload CSV or Excel class list (parsed + stored in DB)
- Live attendance table with PRESENT / ABSENT status
- Per-student log panel (time-in, time-out, duration, history)
- Search + filter students
- Export attendance to CSV / PDF
- Dark / Light mode
- Analytics dashboard

### Security
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with expiry
- Route-level role authorization middleware
- Input validation on all endpoints
- File type + size validation on uploads
- SQL injection prevention (parameterized queries)
- Rate limiting on auth endpoints

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login (student or teacher) |
| POST | /api/auth/register | Register teacher |
| POST | /api/auth/logout | Invalidate session |
| GET  | /api/auth/me | Get current user |

### Attendance
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/attendance/present | Mark present |
| POST | /api/attendance/leave | Mark leave / time-out |
| GET  | /api/attendance/today | Get today's full list (teacher) |
| GET  | /api/attendance/student/:id | Student history |
| GET  | /api/attendance/stats | Summary stats |

### Students
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/students | All students |
| GET  | /api/students/:id | Single student |
| POST | /api/upload/classlist | Upload CSV/Excel |

### Export
| Method | Path | Description |
|--------|------|-------------|
| GET  | /api/export/csv?date=YYYY-MM-DD | Export to CSV |
| GET  | /api/export/pdf?date=YYYY-MM-DD | Export to PDF |
