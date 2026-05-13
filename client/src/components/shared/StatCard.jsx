import React from 'react';

const accents = {
  blue:    'border-l-blue-500',
  yellow:  'border-l-yellow-400',
  green:   'border-l-green-500',
  red:     'border-l-red-500',
  neutral: 'border-l-neutral-300 dark:border-l-neutral-600',
};

export default function StatCard({ label, value, sub, color = 'neutral' }) {
  return (
    <div className={`stat-card border-l-2 ${accents[color] || accents.neutral}`}>
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 leading-none">{value}</p>
      {sub && <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{sub}</p>}
    </div>
  );
}
