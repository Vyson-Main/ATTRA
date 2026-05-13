import React, { useState } from 'react';
import { useApp } from '../../App';
import Avatar from './Avatar';
import ConfirmDialog from './ConfirmDialog';
import ProfileModal from './ProfileModal';

// SVG icon helpers — stroke-based, no fill
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const Icons = {
  sun:     'M12 3v1m0 16v1m8.66-13l-.87.5M4.21 16.5l-.87.5M20.66 16.5l-.87-.5M4.21 7.5l-.87-.5M21 12h-1M4 12H3m15.36-5.64l-.71.71M6.34 17.66l-.71.71M17.66 17.66l-.71-.71M6.34 6.36l-.71-.71M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon:    'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  user:    'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z',
  logout:  'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
};

/**
 * Shared sidebar shell for both teacher and student portals.
 * Props:
 *   navItems: [{ id, label, iconPath }]
 *   activePage: string
 *   onNavigate: fn(id)
 *   mobileOpen: bool
 *   onClose: fn
 *   role: 'teacher' | 'student'
 *   extra: optional ReactNode rendered above footer
 */
export default function SidebarShell({ navItems, activePage, onNavigate, mobileOpen, onClose, role, extra }) {
  const { user, logout, dark, setDark } = useApp();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);

  function handleLogout() { setConfirmLogout(true); }
  function doLogout()     { setConfirmLogout(false); logout(); }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-56 z-40
        bg-white dark:bg-neutral-900
        border-r border-neutral-200 dark:border-neutral-800
        flex flex-col transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">ATTRA</span>
          <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500 capitalize">{role}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            >
              <Icon d={item.iconPath} size={15} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {extra && <div className="px-3 pb-2">{extra}</div>}

        {/* Footer */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 p-3 space-y-1">
          {/* Profile button */}
          <button
            onClick={() => setProfileOpen(true)}
            className="nav-item w-full"
          >
            <Avatar name={user?.name} size="sm" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                {user?.nickname || user?.name}
              </p>
              <p className="text-xs text-neutral-400 truncate">{user?.email || user?.studentId || user?.student_id}</p>
            </div>
          </button>

          <div className="divider my-1" />

          {/* Theme + Logout row */}
          <div className="flex gap-1">
            <button
              onClick={() => setDark(d => !d)}
              className="btn btn-ghost flex-1 justify-center py-1.5 text-xs gap-1.5"
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              <Icon d={dark ? Icons.sun : Icons.moon} size={13} />
              {dark ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-ghost flex-1 justify-center py-1.5 text-xs gap-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Icon d={Icons.logout} size={13} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        title="Sign out?"
        message="You will be returned to the login screen."
        confirmLabel="Sign out"
        danger
        onConfirm={doLogout}
        onCancel={() => setConfirmLogout(false)}
      />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
