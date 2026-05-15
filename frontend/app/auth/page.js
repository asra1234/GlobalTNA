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
    <div className="max-w-md mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4"
      >
        ← Back to jobs
      </Link>

      <div className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-xl">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-8 text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-200 font-semibold mb-2">Account</p>
          <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
          <p className="text-sm text-blue-100">
            Logged-in users can post new job requests and delete existing ones.
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                mode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                mode === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jane Smith"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}