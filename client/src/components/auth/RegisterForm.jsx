import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useApp } from '../../App';
import { useNavigate } from 'react-router-dom';
import { errMsg } from '../../utils/helpers';
import Spinner from '../shared/Spinner';

export default function RegisterForm({ onSwitch }) {
  const { login, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoad]  = useState(false);
  const [showPass, setShow] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, email, password, confirm } = form;
    if (!name.trim() || !email.trim() || !password) {
      toast('error', 'All fields required'); return;
    }
    if (password.length < 6) {
      toast('error', 'Password too short', 'Minimum 6 characters'); return;
    }
    if (password !== confirm) {
      toast('error', 'Passwords do not match'); return;
    }
    setLoad(true);
    try {
      const res = await authAPI.register(name.trim(), email.trim(), password);
      login(res.data.user, res.data.token);
      toast('success', 'Account created');
      navigate('/teacher', { replace: true });
    } catch (err) {
      toast('error', 'Registration failed', errMsg(err));
    } finally {
      setLoad(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Full name</label>
        <input className="input" value={form.name} onChange={set('name')} placeholder="Ms. Jane Santos" autoFocus />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Email address</label>
        <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="jane@school.edu" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Password</label>
        <div className="relative">
          <input
            className="input pr-14"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            placeholder="Minimum 6 characters"
          />
          <button type="button" tabIndex={-1} onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600">
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Confirm password</label>
        <input className="input" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" />
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg mt-1">
        {loading ? <Spinner size="sm" light /> : 'Create account'}
      </button>
      <p className="text-center text-xs text-neutral-400 pt-1">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
