import React from 'react';

const variants = {
  success: { bar: 'bg-green-500',  icon: '✓', text: 'text-green-700 dark:text-green-400' },
  error:   { bar: 'bg-red-500',    icon: '✕', text: 'text-red-700 dark:text-red-400' },
  info:    { bar: 'bg-blue-500',   icon: 'i', text: 'text-blue-700 dark:text-blue-400' },
  warning: { bar: 'bg-yellow-400', icon: '!', text: 'text-yellow-700 dark:text-yellow-400' },
};

export default function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-72 pointer-events-none">
      {toasts.map(t => {
        const v = variants[t.type] || variants.info;
        return (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className="card flex overflow-hidden shadow-sm animate-slide-in cursor-pointer pointer-events-auto"
          >
            <div className={`w-1 flex-shrink-0 ${v.bar}`} />
            <div className="flex items-start gap-2.5 p-3 flex-1 min-w-0">
              <span className={`text-xs font-bold mt-0.5 flex-shrink-0 ${v.text}`}>{v.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{t.title}</p>
                {t.message && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{t.message}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
