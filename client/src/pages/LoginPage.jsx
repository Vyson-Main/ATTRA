import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

export default function LoginPage() {
  const [role, setRole]   = useState('student');
  const [register, setReg] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 p-4">
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">ATTRA</span>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Attendance Tracking System</p>
        </div>

        <div className="card p-6 shadow-sm">
          {register ? (
            <>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-5">
                Teacher Registration
              </p>
              <RegisterForm onSwitch={() => setReg(false)} />
            </>
          ) : (
            <>
              {/* Role tabs */}
              <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-md p-0.5 mb-5 gap-0.5">
                {['student', 'teacher'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all ${
                      role === r
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <LoginForm role={role} />

              {role === 'teacher' && (
                <p className="text-center text-xs text-neutral-400 mt-4">
                  No account?{' '}
                  <button onClick={() => setReg(true)} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Register
                  </button>
                </p>
              )}
            </>
          )}
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-neutral-300 dark:text-neutral-600 mt-5">
          Demo · Student: <code>2023305573</code> · Teacher: <code>teacher@demo.com</code>
        </p>
      </div>
    </div>
  );
}
