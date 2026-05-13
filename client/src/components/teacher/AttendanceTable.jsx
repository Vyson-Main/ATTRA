import React, { useState } from 'react';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';
import { todayISO } from '../../utils/helpers';

export default function AttendanceTable({ rows, onViewLogs, loading }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.name.toLowerCase().includes(q) || (r.student_id || '').toLowerCase().includes(q);
    const matchF = filter === 'all' || (r.status || '').toLowerCase() === filter;
    return matchQ && matchF;
  });

  if (loading) {
    return (
      <div className="card divide-y divide-neutral-100 dark:divide-neutral-800">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-36" />
              <div className="h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded w-20" />
            </div>
            <div className="h-5 w-16 bg-neutral-100 dark:bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-1.5 flex-1 min-w-[160px] max-w-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400 flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="bg-transparent text-sm outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 w-full"
            placeholder="Search name or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-neutral-400 hover:text-neutral-600 text-xs flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
        <div className="flex gap-1">
          {['all', 'present', 'absent'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn text-xs py-1.5 ${filter === f ? 'btn-primary' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-400 ml-auto">{filtered.length}/{rows.length}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide w-8">#</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Student</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden sm:table-cell">ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden lg:table-cell">Time in</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide hidden lg:table-cell">Time out</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-sm text-neutral-400">No results</td></tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={row.student_id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-neutral-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={row.name} size="sm" />
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{row.name}</p>
                        <p className="text-xs text-neutral-400 sm:hidden">{row.student_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400 hidden sm:table-cell font-mono">{row.student_id}</td>
                  <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400 hidden md:table-cell">{todayISO()}</td>
                  <td className="px-4 py-3"><Badge status={row.status} /></td>
                  <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400 hidden lg:table-cell">{row.time_in || '—'}</td>
                  <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400 hidden lg:table-cell">{row.time_out || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onViewLogs(row)} className="btn btn-ghost text-xs py-1 px-2">
                      Logs
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
