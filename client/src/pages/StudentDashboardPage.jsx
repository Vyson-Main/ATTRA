import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { attendanceAPI } from '../services/api';
import { errMsg, todayISO } from '../utils/helpers';
import LiveClock from '../components/student/LiveClock';
import AttendanceButtons from '../components/student/AttendanceButtons';
import SidebarShell from '../components/shared/SidebarShell';
import Badge from '../components/shared/Badge';

const STUDENT_NAV = [
  { id: 'home',    label: 'Home',            iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'history', label: 'My attendance',   iconPath: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
];

export default function StudentDashboardPage() {
  const { user, toast } = useApp();

  const [page,         setPage]         = useState('home');
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [marked,       setMarked]       = useState(false);
  const [leftOut,      setLeftOut]      = useState(false);
  const [timeIn,       setTimeIn]       = useState(null);
  const [loadPresent,  setLoadPresent]  = useState(false);
  const [loadLeave,    setLoadLeave]    = useState(false);
  const [history,      setHistory]      = useState([]);
  const [histLoading,  setHistLoading]  = useState(false);

  const studentId = user?.studentId || user?.student_id;

  // Check today's status and load history on mount
  useEffect(() => {
    if (!studentId) return;
    setHistLoading(true);
    attendanceAPI.getHistory(studentId)
      .then(res => {
        const records = res.data.history || [];
        setHistory(records);
        const today = records.find(r => r.date === todayISO());
        if (today) {
          setMarked(true);
          setTimeIn(today.time_in);
          if (today.time_out) setLeftOut(true);
        }
      })
      .catch(() => {})
      .finally(() => setHistLoading(false));
  }, [studentId]);

  // 30-min inactivity logout
  useEffect(() => {
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        toast('info', 'Session expired', 'Logged out due to inactivity');
        // logout handled by 401 interceptor
        window.location.href = '/login';
      }, 30 * 60 * 1000);
    };
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => { clearTimeout(timer); events.forEach(e => window.removeEventListener(e, reset)); };
  }, []);

  async function handlePresent() {
    setLoadPresent(true);
    try {
      const res = await attendanceAPI.markPresent();
      const rec = res.data.record;
      setMarked(true);
      setTimeIn(rec.time_in);
      setHistory(h => [rec, ...h]);
      toast('success', 'Attendance recorded', `Time in: ${rec.time_in}`);
    } catch (err) {
      if (err.response?.status === 409) {
        const rec = err.response.data.record;
        setMarked(true);
        if (rec?.time_in) setTimeIn(rec.time_in);
      }
      toast('error', 'Could not record attendance', errMsg(err));
    } finally {
      setLoadPresent(false);
    }
  }

  async function handleLeave() {
    setLoadLeave(true);
    try {
      const res = await attendanceAPI.markLeave();
      const rec = res.data.record;
      setLeftOut(true);
      setHistory(h => h.map(r => r.date === todayISO() ? rec : r));
      toast('success', 'Time-out recorded', `Duration: ${rec.duration || '—'}`);
      setTimeout(() => window.location.href = '/login', 2200);
    } catch (err) {
      toast('error', 'Could not record leave', errMsg(err));
      setLoadLeave(false);
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <SidebarShell
        navItems={STUDENT_NAV}
        activePage={page}
        onNavigate={setPage}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        role="student"
      />

      <div className="flex-1 flex flex-col lg:ml-56 min-w-0">
        {/* Topbar */}
        <header className="h-12 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 px-4 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(o => !o)} className="btn btn-ghost p-1.5 lg:hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex-1">
            {page === 'home' ? 'Dashboard' : 'My Attendance'}
          </h1>
          <span className="text-xs text-neutral-400 hidden sm:block">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-lg mx-auto w-full">
          {page === 'home' ? (
            <div className="space-y-4 animate-in">
              {/* Date */}
              <p className="text-xs text-neutral-400 dark:text-neutral-500">{today}</p>

              {/* Clock */}
              <div className="card p-5">
                <LiveClock />
              </div>

              {/* Status banner */}
              {marked && (
                <div className={`card p-4 flex items-center gap-3 border-l-2 ${leftOut ? 'border-l-neutral-300' : 'border-l-green-500'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={leftOut ? 'text-neutral-400' : 'text-green-600'}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/>
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {leftOut ? 'Departed' : 'Present'}
                    </p>
                    <p className="text-xs text-neutral-400">Time in: {timeIn}</p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="card p-5">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
                  Today's attendance
                </p>
                <AttendanceButtons
                  marked={marked}
                  leftOut={leftOut}
                  timeIn={timeIn}
                  onPresent={handlePresent}
                  onLeave={handleLeave}
                  loadingPresent={loadPresent}
                  loadingLeave={loadLeave}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Attendance history</p>
              {histLoading ? (
                <div className="card p-8 flex justify-center">
                  <div className="w-5 h-5 border-2 border-neutral-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="card p-10 text-center">
                  <p className="text-sm text-neutral-400">No records yet.</p>
                </div>
              ) : (
                <div className="card divide-y divide-neutral-100 dark:divide-neutral-800">
                  {history.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{r.date}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          In: {r.time_in || '—'}
                          {r.time_out && <> · Out: {r.time_out}</>}
                          {r.duration && <> · {r.duration}</>}
                        </p>
                      </div>
                      <Badge status={r.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
