'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { loginUser, registerUser } from '../../lib/api';
import { storeAuth } from '../../lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState('/');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get('next') || '/');
  }, []);

  const title = useMemo(
    () => (mode === 'login' ? 'Sign in to continue' : 'Create your account'),
    [mode]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!EMAIL_REGEX.test(form.email)) {
      setError('Enter a valid email address');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (mode === 'register' && !form.name.trim()) {
      setError('Name is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const auth = mode === 'login'
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({
            name: form.name.trim(),
            email: form.email,
            password: form.password,
          });

      storeAuth(auth);
      router.push(nextPath);
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-white"
      >
        ← Back to jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel-strong relative overflow-hidden px-6 py-8 text-slate-900 sm:px-8 sm:py-10">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="relative">
            <p className="section-label mb-3">Account access</p>
            <h1 className="max-w-sm text-4xl font-extrabold leading-tight text-slate-900">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              Save time with a cleaner return flow. Once signed in, you can post jobs, manage requests, and delete protected items securely.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-teal-50 px-4 py-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Secure</p>
                <p className="mt-2 text-sm text-slate-600">JWT-backed access for protected actions.</p>
              </div>
              <div className="rounded-3xl bg-amber-50 px-4 py-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Fast</p>
                <p className="mt-2 text-sm text-slate-600">Return to the exact task you started.</p>
              </div>
              <div className="rounded-3xl bg-white px-4 py-4 shadow-sm animate-fade-up" style={{ animationDelay: '180ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Simple</p>
                <p className="mt-2 text-sm text-slate-600">One screen for sign in and registration.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel px-6 py-6 sm:px-8 sm:py-8">
          <div className="inline-flex rounded-2xl bg-white/70 p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="soft-input"
                  placeholder="Jane Smith"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="soft-input"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="soft-input"
                placeholder="At least 6 characters"
              />
            </div>

            <button type="submit" disabled={submitting} className="primary-button w-full">
              {submitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}