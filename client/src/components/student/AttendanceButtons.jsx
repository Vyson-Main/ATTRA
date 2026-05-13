import React from 'react';
import Spinner from '../shared/Spinner';

export default function AttendanceButtons({ marked, leftOut, timeIn, onPresent, onLeave, loadingPresent, loadingLeave }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Present */}
        <button
          onClick={onPresent}
          disabled={marked || loadingPresent}
          className={`
            flex flex-col items-center gap-2 py-5 px-3 rounded-lg border-2 font-semibold text-sm transition-all
            ${marked
              ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 text-green-300 dark:text-green-800 cursor-not-allowed'
              : 'border-green-500 dark:border-green-600 bg-white dark:bg-neutral-900 text-green-700 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white active:scale-95'
            }
          `}
        >
          {loadingPresent ? (
            <Spinner size="md" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
            </svg>
          )}
          <span>{marked ? 'Recorded' : 'Present'}</span>
        </button>

        {/* Leave */}
        <button
          onClick={onLeave}
          disabled={!marked || leftOut || loadingLeave}
          className={`
            flex flex-col items-center gap-2 py-5 px-3 rounded-lg border-2 font-semibold text-sm transition-all
            ${!marked || leftOut
              ? 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/30 text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
              : 'border-red-500 dark:border-red-600 bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white active:scale-95'
            }
          `}
        >
          {loadingLeave ? (
            <Spinner size="md" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          )}
          <span>{leftOut ? 'Departed' : 'Leave'}</span>
        </button>
      </div>

      <p className="text-xs text-center text-neutral-400 dark:text-neutral-500">
        {leftOut
          ? 'Logging you out\u2026'
          : marked
          ? `Checked in at ${timeIn}. Tap Leave when departing.`
          : 'Tap Present to log your attendance for today.'}
      </p>
    </div>
  );
}
