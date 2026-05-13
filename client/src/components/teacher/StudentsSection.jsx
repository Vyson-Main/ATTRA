import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';
import { errMsg } from '../../utils/helpers';
import Avatar from '../shared/Avatar';
import Spinner from '../shared/Spinner';
import EmptyState from '../shared/EmptyState';

export default function StudentsSection({ refreshKey }) {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    setLoading(true);
    studentsAPI.getAll()
      .then(res => { setStudents(res.data.students || []); setError(null); })
      .catch(err => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = students.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-1.5 flex-1 max-w-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400 flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="bg-transparent text-sm outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 w-full"
            placeholder="Search students"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-neutral-400">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="card p-6 text-center text-sm text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No students" message="Upload a class list to get started." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(s => (
            <div key={s.student_id} className="card p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <Avatar name={s.name} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{s.name}</p>
                  <p className="text-xs text-neutral-400 font-mono">{s.student_id}</p>
                </div>
              </div>
              {s.section && (
                <span className="badge badge-blue">{s.section}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
