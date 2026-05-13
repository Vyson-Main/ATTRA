import React, { useEffect } from 'react';

export default function SlidePanel({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25 dark:bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 h-full flex flex-col shadow-xl animate-slide-in border-l border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
            {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 p-0 justify-center" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
