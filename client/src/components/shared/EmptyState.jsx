import React from 'react';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{title}</p>
      {message && <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4 max-w-xs">{message}</p>}
      {action}
    </div>
  );
}
