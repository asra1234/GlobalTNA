'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { clearAuth, getStoredAuth } from '../lib/auth';

export default function AuthNav() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const syncAuth = () => setAuth(getStoredAuth());

    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-change', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-change', syncAuth);
    };
  }, []);

  if (!auth) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth"
          className="flex items-center gap-1.5 border border-white/30 bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/jobs/new"
          className="flex items-center gap-1.5 bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-sm"
        >
          <span className="text-base leading-none">＋</span> Post a Job
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-sm text-blue-100">Signed in as {auth.user?.name || auth.user?.email}</span>
      <Link
        href="/jobs/new"
        className="flex items-center gap-1.5 bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-sm"
      >
        <span className="text-base leading-none">＋</span> Post a Job
      </Link>
      <button
        type="button"
        onClick={clearAuth}
        className="border border-white/25 bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}