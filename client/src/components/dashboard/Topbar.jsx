import React from 'react';

export default function Topbar({ title, onMenuToggle, children }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
  return (
    <header className="h-12 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 px-4 sticky top-0 z-20">
      <button
        onClick={onMenuToggle}
        className="btn btn-ghost p-1.5 lg:hidden"
        aria-label="Toggle menu"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
      <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex-1 truncate">{title}</h1>
      <span className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:block">{today}</span>
      {children}
    </header>
  );
}
