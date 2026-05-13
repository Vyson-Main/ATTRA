import React, { useState, useEffect } from 'react';
import SlidePanel from '../shared/SlidePanel';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';
import Spinner from '../shared/Spinner';
import { attendanceAPI } from '../../services/api';
import { errMsg, fmtDate } from '../../utils/helpers';

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-50 dark:border-neutral-800 last:border-0 text-sm">
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="font-medium text-neutral-800 dark:text-neutral-200">{value}</span>
    </div>
  );
}

export default function StudentLogPanel({ student, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!student) return;
    setLoading(true);
    setError(null);
    attendanceAPI.getHistory(student.student_id)
      .then(res => setHistory(res.data.history || []))
      .catch(err => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [student?.student_id]);

  const presentCount = history.filter(r => r.status === 'PRESENT').length;

  return (
    <SlidePanel open={!!student} onClose={onClose} title="Student logs" subtitle={student?.name}>
      {student && (
        <div className="space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <Avatar name={student.name} size="lg" />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{student.name}</p>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{student.student_id}</p>
              {student.section && <span className="badge badge-blue mt-1">{student.section}</span>}
            </div>
          </div>

          {/* Today */}
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Today</p>
            <div className="card p-3">
              <Row label="Status"   value={<Badge status={student.status} />} />
              <Row label="Time in"  value={student.time_in  || '—'} />
              <Row label="Time out" value={student.time_out || '—'} />
              <Row label="Duration" value={student.duration || '—'} />
            </div>
          </div>

          {/* History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">History</p>
              {history.length > 0 && (
                <span className="text-xs text-neutral-400">{presentCount}/{history.length} days</span>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : error ? (
              <p className="text-sm text-red-500 text-center py-4">{error}</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-6">No records yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map(rec => (
                  <div key={rec.id} className="card p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{fmtDate(rec.date)}</p>
                      <Badge status={rec.status} />
                    </div>
                    <p className="text-xs text-neutral-400">
                      In: {rec.time_in || '—'}
                      {rec.time_out && <> · Out: {rec.time_out}</>}
                      {rec.duration && <> · {rec.duration}</>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SlidePanel>
  );
}
