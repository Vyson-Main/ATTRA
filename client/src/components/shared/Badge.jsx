import React from 'react';

const map = {
  present: 'badge-present',
  absent:  'badge-absent',
  late:    'badge-late',
  blue:    'badge-blue',
};

export default function Badge({ status }) {
  const key = (status || 'absent').toLowerCase();
  return (
    <span className={`badge ${map[key] || 'badge-absent'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {(status || 'ABSENT').toUpperCase()}
    </span>
  );
}
