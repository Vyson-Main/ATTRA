import React, { useState } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { useApp } from '../../App';
import { exportAPI } from '../../services/api';
import { todayISO, downloadBlob, errMsg } from '../../utils/helpers';
import AttendanceTable from './AttendanceTable';
import StatCard from '../shared/StatCard';

export default function AttendanceSection({ refreshKey, onViewLogs }) {
  const { toast } = useApp();
  const [date, setDate]       = useState(todayISO());
  const { rows, stats, loading, refresh } = useAttendance(date, refreshKey);
  const [exporting, setExp]   = useState(false);

  async function doExport(type) {
    setExp(true);
    try {
      const res = type === 'excel' ? await exportAPI.excel(date) : await exportAPI.pdf(date);
      downloadBlob(res.data, `attendance_${date}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      toast('success', 'Export downloaded');
    } catch (err) {
      toast('error', 'Export failed', errMsg(err));
    } finally {
      setExp(false);
    }
  }

  return (
    <div className="space-y-4 animate-in">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-neutral-500">Date</label>
          <input type="date" value={date} max={todayISO()} onChange={e => setDate(e.target.value)} className="input py-1.5 text-sm w-auto" />
        </div>
        <button onClick={refresh} className="btn text-xs py-1.5" disabled={loading}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
          Refresh
        </button>
        <div className="ml-auto flex gap-1.5">
          <button onClick={() => doExport('excel')} disabled={exporting} className="btn text-xs py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Excel
          </button>
          <button onClick={() => doExport('pdf')} disabled={exporting} className="btn text-xs py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            PDF
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total"   value={stats.total}      color="blue"   />
        <StatCard label="Present" value={stats.present}    color="green"  />
        <StatCard label="Absent"  value={stats.absent}     color="red"    />
        <StatCard label="Rate"    value={`${stats.rate}%`} color="yellow" />
      </div>
      <AttendanceTable rows={rows} onViewLogs={onViewLogs} loading={loading} />
    </div>
  );
}
