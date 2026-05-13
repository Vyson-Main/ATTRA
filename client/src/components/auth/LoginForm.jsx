import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useApp } from '../../App';
import { useNavigate } from 'react-router-dom';
import { errMsg } from '../../utils/helpers';
import Spinner from '../shared/Spinner';

/* Student ID: exactly 10 digits, first 4 = valid year (2000–2099) */
function validateStudentId(id) {
  if (!/^\d{10}$/.test(id)) return 'Student ID must be exactly 10 digits';
  const year = parseInt(id.slice(0, 4), 10);
  if (year < 2000 || year > 2099) return 'First 4 digits must be a valid year (2000–2099)';
  return null;
}

export default function LoginForm({ role }) {
  const { login, toast } = useApp();
  const navigate = useNavigate();
  const [id, setId]           = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [idError, setIdError] = useState('');

  function handleIdChange(e) {
    const val = e.target.value;
    if (role === 'student') {
      // Only allow digits, max 10
      const digits = val.replace(/\D/g, '').slice(0, 10);
      setId(digits);
      setIdError(digits.length > 0 ? (validateStudentId(digits) || '') : '');
    } else {
      setId(val);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (role === 'student') {
      const err = validateStudentId(id);
      if (err) { setIdError(err); return; }
    }
    if (!id.trim() || !password) {
      toast('error', 'Missing fields', 'Please enter your credentials');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(id.trim(), password, role);
      login(res.data.user, res.data.token);
      toast('success', 'Welcome back');
      navigate(role === 'teacher' ? '/teacher' : '/student', { replace: true });
    } catch (err) {
      toast('error', 'Login failed', errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
          {role === 'student' ? 'Student ID' : 'Email address'}
        </label>
        <input
          className={`input ${idError ? 'border-red-400 focus:ring-red-400' : ''}`}
          value={id}
          onChange={handleIdChange}
          placeholder={role === 'student' ? '10-digit ID (e.g. 2023305573)' : 'you@school.edu'}
          autoFocus
          autoComplete="username"
          inputMode={role === 'student' ? 'numeric' : 'email'}
          maxLength={role === 'student' ? 10 : undefined}
        />
        {idError && (
          <p className="text-xs text-red-500 mt-1">{idError}</p>
        )}
        {role === 'student' && !idError && id.length > 0 && (
          <p className="text-xs text-neutral-400 mt-1">{id.length}/10 digits</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            className="input pr-14"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPass(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg mt-1">
        {loading ? <Spinner size="sm" light /> : 'Sign in'}
      </button>
    </form>
  );
}
