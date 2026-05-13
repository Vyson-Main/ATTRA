import React, { useState, useEffect } from 'react';
import UploadZone from './UploadZone';
import { uploadAPI } from '../../services/api';
import Spinner from '../shared/Spinner';

export default function UploadSection({ onSuccess }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadHistory() {
    uploadAPI.getHistory()
      .then(res => setHistory(res.data.uploads || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadHistory(); }, []);

  function handleSuccess(data) {
    loadHistory();
    onSuccess?.(data);
  }

  return (
    <div className="space-y-5 animate-in max-w-xl">
      <div className="card p-5">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">Upload class list</p>
        <p className="text-xs text-neutral-400 mb-4">Importing a new file will replace the current student roster.</p>
        <UploadZone onSuccess={handleSuccess} />
      </div>

      <div className="card p-5">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">Upload history</p>
        {loading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : history.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-4">No uploads yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {history.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{u.original_name || u.filename}</p>
                  <p className="text-xs text-neutral-400">{new Date(u.created_at).toLocaleString()}</p>
                </div>
                <span className="badge badge-blue">{u.student_count} students</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
