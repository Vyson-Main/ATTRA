import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import ToastContainer from './components/shared/ToastContainer';
import LoginPage from './pages/LoginPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function RequireAuth({ children, role }) {
  const { user, isAuthenticated, loading } = useApp();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-blue-600 rounded-full animate-spin"/>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }
  return children;
}

export default function App() {
  const auth = useAuth();
  const { toasts, toast, dismiss } = useToast();
  const [dark, setDark] = useState(() => localStorage.getItem('at_dark') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('at_dark', dark);
  }, [dark]);

  // Allow profile updates to refresh the stored user
  const loginWithUpdate = useCallback((user, token) => {
    auth.login(user, token);
  }, [auth.login]);

  const ctx = {
    ...auth,
    login: loginWithUpdate,
    toast,
    dark,
    setDark,
  };

  return (
    <AppContext.Provider value={ctx}>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <Routes>
        <Route path="/login" element={
          auth.isAuthenticated
            ? <Navigate to={auth.user?.role === 'teacher' ? '/teacher' : '/student'} replace />
            : <LoginPage />
        }/>
        <Route path="/student" element={
          <RequireAuth role="student"><StudentDashboardPage /></RequireAuth>
        }/>
        <Route path="/teacher/*" element={
          <RequireAuth role="teacher"><TeacherDashboardPage /></RequireAuth>
        }/>
        <Route path="/" element={
          auth.isAuthenticated
            ? <Navigate to={auth.user?.role === 'teacher' ? '/teacher' : '/student'} replace />
            : <Navigate to="/login" replace />
        }/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppContext.Provider>
  );
}
