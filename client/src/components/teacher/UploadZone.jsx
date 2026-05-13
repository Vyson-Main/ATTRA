import React, { useRef, useState } from 'react';
import { uploadAPI } from '../../services/api';
import { useApp } from '../../App';
import { errMsg } from '../../utils/helpers';
import Spinner from '../shared/Spinner';

export default function UploadZone({ onSuccess }) {
  const { toast } = useApp();
  const fileRef = useRef();
  const [drag,     setDrag]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);

  async function processFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      toast('error', 'Invalid file type', 'Upload CSV or Excel (.csv .xlsx .xls)');
      return;
    }
    setLoading(true);
    setProgress(0);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await uploadAPI.uploadClassList(fd, e => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      toast('success', `${res.data.students.length} students imported`);
      onSuccess?.(res.data);
    } catch (err) {
      toast('error', 'Upload failed', errMsg(err));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  return (
    <div>
      <div
        onClick={() => !loading && fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); }}
        className={`
          border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all
          ${drag
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : 'border-neutral-200 dark:border-neutral-700 hover:border-blue-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
          }
          ${loading ? 'pointer-events-none' : ''}
        `}
      >
        {loading ? (
          <div className="space-y-3">
            <div className="flex justify-center"><Spinner size="lg" /></div>
            <p className="text-sm text-neutral-500">{progress > 0 ? `Uploading ${progress}%` : 'Parsing file\u2026'}</p>
            {progress > 0 && (
              <div className="w-40 mx-auto bg-neutral-200 dark:bg-neutral-700 rounded-full h-1">
                <div className="bg-blue-600 h-1 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={drag ? 'text-blue-500' : 'text-neutral-300 dark:text-neutral-600'}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {drag ? 'Drop to upload' : 'Drop file or click to browse'}
            </p>
            <p className="text-xs text-neutral-400">CSV · XLSX · XLS — max 10 MB</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
        onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = ''; }} />

      <div className="mt-3 px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-md border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
        Required columns: <code className="font-mono">id</code>, <code className="font-mono">name</code> — optional: <code className="font-mono">section</code>
      </div>
    </div>
  );
}
