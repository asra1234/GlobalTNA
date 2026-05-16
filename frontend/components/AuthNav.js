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
          className="hidden rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white sm:inline-flex"
        >
          Sign In
        </Link>
        <Link
          href="/jobs/new"
          className="primary-button px-4 py-2.5 text-sm"
        >
          <span className="text-base leading-none">＋</span> Post a Job
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-2xl border border-white/60 bg-white/65 px-3 py-2 text-right shadow-sm sm:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Signed in</p>
        <p className="text-sm font-semibold text-slate-700">{auth.user?.name || auth.user?.email}</p>
      </div>
      <Link
        href="/jobs/new"
        className="primary-button px-4 py-2.5 text-sm"
      >
        <span className="text-base leading-none">＋</span> Post a Job
      </Link>
      <button
        type="button"
        onClick={clearAuth}
        className="secondary-button px-4 py-2.5"
      >
        Log Out
      </button>
    </div>
  );
}