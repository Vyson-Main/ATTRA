import React from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { todayISO } from '../../utils/helpers';
import StatCard from '../shared/StatCard';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';
import Spinner from '../shared/Spinner';
import EmptyState from '../shared/EmptyState';

export default function OverviewSection({ refreshKey, onNavigate, onViewLogs }) {
  const { rows, stats, loading } = useAttendance(todayISO(), refreshKey);
  const recent = rows.filter(r => r.status === 'PRESENT').slice(0, 6);

  return (
    <div className="space-y-4 animate-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total"   value={stats.total}        sub="Students"   color="blue"    />
        <StatCard label="Present" value={stats.present}      sub="Today"      color="green"   />
        <StatCard label="Absent"  value={stats.absent}       sub="Today"      color="red"     />
        <StatCard label="Rate"    value={`${stats.rate}%`}   sub="Attendance" color="yellow"  />
      </div>

      {/* Progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Attendance rate</span>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{stats.present}/{stats.total}</span>
        </div>
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-blue-600 transition-all duration-700"
            style={{ width: `${stats.rate}%` }}
          />
        </div>
      </div>

      {/* Recent check-ins */}
      <div className="card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Recent check-ins</span>
          <button onClick={() => onNavigate('attendance')} className="btn btn-ghost text-xs py-1 px-2">
            View all
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : recent.length === 0 ? (
          <EmptyState title="No check-ins yet" message="Students who mark present will appear here." />
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
            {recent.map(row => (
              <div
                key={row.student_id}
                onClick={() => onViewLogs(row)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <Avatar name={row.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{row.name}</p>
                  <p className="text-xs text-neutral-400">{row.student_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {row.time_in && <span className="text-xs text-neutral-400">{row.time_in}</span>}
                  <Badge status={row.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
