import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 p-4">
      <div className="text-center">
        <p className="text-7xl font-black text-neutral-100 dark:text-neutral-800 mb-4 select-none">404</p>
        <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Page not found</h1>
        <p className="text-sm text-neutral-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Go home</Link>
      </div>
    </div>
  );
}
