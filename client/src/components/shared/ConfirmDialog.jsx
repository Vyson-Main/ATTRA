import React, { useEffect } from 'react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCancel(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 animate-fade-in" onClick={onCancel} />
      <div className="relative card p-6 w-full max-w-sm shadow-lg animate-in">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{title}</h3>
        {message && <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">{message}</p>}
        <div className="flex gap-2 justify-end mt-5">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button
            className={`btn ${danger ? 'btn-danger-outline' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
