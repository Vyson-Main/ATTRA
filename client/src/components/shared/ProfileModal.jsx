import React, { useState } from 'react';
import { useApp } from '../../App';
import { authAPI } from '../../services/api';
import { errMsg } from '../../utils/helpers';
import Avatar from './Avatar';
import Spinner from './Spinner';

export default function ProfileModal({ open, onClose }) {
  const { user, login, token, toast } = useApp();
  const [tab, setTab] = useState('profile');

  // Profile tab state
  const [name, setName]       = useState(user?.name || '');
  const [nickname, setNick]   = useState(user?.nickname || '');
  const [saving, setSaving]   = useState(false);

  // Password tab state
  const [current, setCurrent]   = useState('');
  const [next, setNext]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [changing, setChanging] = useState(false);
  const [showPw, setShowPw]     = useState(false);

  if (!open) return null;

  async function saveProfile(e) {
    e.preventDefault();
    if (!name.trim()) { toast('error', 'Name cannot be empty'); return; }
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ name: name.trim(), nickname: nickname.trim() });
      login({ ...user, name: res.data.name, nickname: res.data.nickname }, token);
      toast('success', 'Profile updated');
      onClose();
    } catch (err) {
      toast('error', 'Update failed', errMsg(err));
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (!current || !next || !confirm) { toast('error', 'All fields required'); return; }
    if (next.length < 6) { toast('error', 'Password too short', 'Minimum 6 characters'); return; }
    if (next !== confirm) { toast('error', 'Passwords do not match'); return; }
    setChanging(true);
    try {
      await authAPI.changePassword({ currentPassword: current, newPassword: next });
      toast('success', 'Password changed');
      setCurrent(''); setNext(''); setConfirm('');
      onClose();
    } catch (err) {
      toast('error', 'Failed to change password', errMsg(err));
    } finally {
      setChanging(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 dark:bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative card w-full max-w-md shadow-lg animate-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Account settings</span>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 p-0 justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* User identity strip */}
        <div className="flex items-center gap-3 px-5 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
          <Avatar name={user?.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user?.name}</p>
            <p className="text-xs text-neutral-400">{user?.email || user?.studentId || user?.student_id}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800 px-5">
          {['profile', 'password'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-xs font-semibold border-b-2 mr-5 transition-colors ${
                tab === t
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'profile' ? (
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Display name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  Nickname <span className="text-neutral-300 dark:text-neutral-600">(optional)</span>
                </label>
                <input className="input" value={nickname} onChange={e => setNick(e.target.value)} placeholder="How should we call you?" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Spinner size="sm" light /> : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Current password</label>
                <div className="relative">
                  <input className="input pr-14" type={showPw ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} autoFocus />
                  <button type="button" tabIndex={-1} onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600">
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">New password</label>
                <input className="input" type={showPw ? 'text' : 'password'} value={next} onChange={e => setNext(e.target.value)} placeholder="Minimum 6 characters" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Confirm new password</label>
                <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={changing}>
                  {changing ? <Spinner size="sm" light /> : 'Change password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
