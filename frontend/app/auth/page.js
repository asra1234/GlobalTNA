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
    () => (mode === 'login' ? 'Welcome back' : 'Create your account'),
    [mode]
  );

  const subtitle = useMemo(
    () =>
      mode === 'login'
        ? 'Sign in to post, manage, and track jobs.'
        : 'Join in a minute and start managing jobs with less friction.',
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
        ← Back home
      </Link>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="glass-panel-strong relative overflow-hidden px-6 py-8 text-slate-900 sm:px-8 sm:py-10">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="relative">
            <p className="section-label mb-3">Account</p>
            <h1 className="font-display max-w-md text-4xl font-semibold leading-tight text-slate-900 sm:text-[2.8rem]">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
              {subtitle}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-500">
              Use one simple form to sign in or create an account and continue straight to your next step.
            </p>
          </div>
        </section>

        <section className="glass-panel px-6 py-6 sm:px-8 sm:py-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{mode === 'login' ? 'Sign in' : 'Sign up'}</p>
          </div>

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
              Sign Up
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
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
              {submitting ? 'Please wait…' : mode === 'login' ? 'Continue' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-teal-700 transition hover:text-teal-800"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}