import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import OverviewSection from '../components/teacher/OverviewSection';
import AttendanceSection from '../components/teacher/AttendanceSection';
import StudentsSection from '../components/teacher/StudentsSection';
import UploadSection from '../components/teacher/UploadSection';
import AnalyticsSection from '../components/teacher/AnalyticsSection';
import StudentLogPanel from '../components/teacher/StudentLogPanel';

const PAGE_TITLES = {
  '':           'Overview',
  'overview':   'Overview',
  'attendance': 'Attendance',
  'students':   'Students',
  'upload':     'Upload class list',
  'analytics':  'Analytics',
};

export default function TeacherDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logStudent, setLogStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const segment = location.pathname.replace('/teacher', '').replace(/^\//, '');
  const activePage = segment || 'overview';
  const title = PAGE_TITLES[activePage] || 'Dashboard';

  const handleNavigate = useCallback((page) => {
    navigate(page === 'overview' ? '/teacher' : `/teacher/${page}`);
  }, [navigate]);

  const handleUploadSuccess = useCallback(() => {
    setRefreshKey(k => k + 1);
    navigate('/teacher/attendance');
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-56 min-w-0">
        <Topbar title={title} onMenuToggle={() => setMobileOpen(o => !o)} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Routes>
            <Route index element={
              <OverviewSection refreshKey={refreshKey} onNavigate={handleNavigate} onViewLogs={setLogStudent} />
            }/>
            <Route path="overview" element={
              <OverviewSection refreshKey={refreshKey} onNavigate={handleNavigate} onViewLogs={setLogStudent} />
            }/>
            <Route path="attendance" element={
              <AttendanceSection refreshKey={refreshKey} onViewLogs={setLogStudent} />
            }/>
            <Route path="students" element={<StudentsSection refreshKey={refreshKey} />}/>
            <Route path="upload"   element={<UploadSection onSuccess={handleUploadSuccess} />}/>
            <Route path="analytics" element={<AnalyticsSection refreshKey={refreshKey} />}/>
          </Routes>
        </main>
      </div>

      <StudentLogPanel student={logStudent} onClose={() => setLogStudent(null)} />
    </div>
  );
}
