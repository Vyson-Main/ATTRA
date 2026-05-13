import React from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { todayISO } from '../../utils/helpers';
import StatCard from '../shared/StatCard';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';
import Spinner from '../shared/Spinner';

export default function AnalyticsSection({ refreshKey }) {
  const { rows, stats, loading } = useAttendance(todayISO(), refreshKey);
  const sorted      = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  const presentRows = rows.filter(r => r.status === 'PRESENT');
  const absentRows  = rows.filter(r => r.status !== 'PRESENT');

  return (
    <div className="space-y-4 animate-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total"   value={stats.total}      color="blue"   />
        <StatCard label="Present" value={stats.present}    color="green"  />
        <StatCard label="Absent"  value={stats.absent}     color="red"    />
        <StatCard label="Rate"    value={`${stats.rate}%`} color="yellow" />
      </div>

      {/* Donut chart */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">Breakdown</p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="none"
                className="stroke-neutral-100 dark:stroke-neutral-800" strokeWidth="3" />
              {stats.total > 0 && (
                <circle cx="18" cy="18" r="15.915" fill="none"
                  stroke="#2563eb" strokeWidth="3"
                  strokeDasharray={`${stats.rate} ${100 - stats.rate}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{stats.rate}%</span>
            </div>
          </div>
          <div className="flex-1 w-full space-y-3">
            <BarRow label="Present" count={stats.present} total={stats.total} color="bg-green-500" />
            <BarRow label="Absent"  count={stats.absent}  total={stats.total} color="bg-red-400"   />
          </div>
        </div>
      </div>

      {/* Per-student */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">Per student</p>
        {loading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : (
          <div className="space-y-3">
            {sorted.map(r => (
              <div key={r.student_id} className="flex items-center gap-3">
                <Avatar name={r.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">{r.name}</p>
                    <Badge status={r.status} />
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${r.status === 'PRESENT' ? 'bg-green-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                      style={{ width: r.status === 'PRESENT' ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two column lists */}
      <div className="grid sm:grid-cols-2 gap-3">
        <RosterList title="Present" count={presentRows.length} rows={presentRows} showTime />
        <RosterList title="Absent"  count={absentRows.length}  rows={absentRows}  />
      </div>
    </div>
  );
}

function BarRow({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
        <span className="text-neutral-500">{count} ({pct}%)</span>
      </div>
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RosterList({ title, count, rows, showTime }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
        {title} ({count})
      </p>
      {rows.length === 0 ? (
        <p className="text-xs text-neutral-400">{title === 'Present' ? 'None yet' : 'All present'}</p>
      ) : (
        <div className="space-y-2">
          {rows.map(r => (
            <div key={r.student_id} className="flex items-center gap-2">
              <Avatar name={r.name} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">{r.name}</p>
                {showTime && r.time_in && <p className="text-xs text-neutral-400">{r.time_in}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
