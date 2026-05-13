import React from 'react';
import SidebarShell from '../shared/SidebarShell';

const NAV = [
  { id: 'overview',   label: 'Overview',         iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'attendance', label: 'Attendance',        iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'students',   label: 'Students',          iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { id: 'upload',     label: 'Upload class list', iconPath: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12' },
  { id: 'analytics',  label: 'Analytics',         iconPath: 'M18 20V10M12 20V4M6 20v-6' },
];

export default function Sidebar({ activePage, onNavigate, mobileOpen, onClose }) {
  return (
    <SidebarShell
      navItems={NAV}
      activePage={activePage}
      onNavigate={onNavigate}
      mobileOpen={mobileOpen}
      onClose={onClose}
      role="teacher"
    />
  );
}
