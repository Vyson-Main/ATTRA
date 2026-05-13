-- AttendTrack Database Schema
-- Run: node server/scripts/migrate.js

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users (teachers + students) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  student_id    VARCHAR(50)  UNIQUE,           -- NULL for teachers
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(255) UNIQUE,            -- NULL for students
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL CHECK (role IN ('student', 'teacher')),
  section       VARCHAR(100),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role);

-- ── Students ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id            SERIAL PRIMARY KEY,
  student_id    VARCHAR(50)  NOT NULL UNIQUE,
  name          VARCHAR(200) NOT NULL,
  section       VARCHAR(100),
  email         VARCHAR(255),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- ── Attendance ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id            SERIAL PRIMARY KEY,
  student_id    VARCHAR(50)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  date          DATE         NOT NULL,
  time_in       VARCHAR(30),
  time_out      VARCHAR(30),
  duration      VARCHAR(30),
  status        VARCHAR(20)  NOT NULL DEFAULT 'PRESENT' CHECK (status IN ('PRESENT', 'ABSENT', 'LATE')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_date       ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);

-- ── Uploads ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS uploads (
  id            SERIAL PRIMARY KEY,
  teacher_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  student_count INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── updated_at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at      ON users;
DROP TRIGGER IF EXISTS trg_attendance_updated_at ON attendance;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add nickname column if not exists (safe to run multiple times)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'nickname'
  ) THEN
    ALTER TABLE users ADD COLUMN nickname VARCHAR(100);
  END IF;
END $$;
