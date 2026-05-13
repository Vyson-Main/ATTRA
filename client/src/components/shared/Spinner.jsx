import React from 'react';

export default function Spinner({ size = 'md', light = false }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-4' }[size];
  const c = light ? 'border-white/30 border-t-white' : 'border-gray-200 border-t-indigo-600 dark:border-gray-600 dark:border-t-indigo-400';
  return <div className={`${s} ${c} rounded-full animate-spin`} />;
}
