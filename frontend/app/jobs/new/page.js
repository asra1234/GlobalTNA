'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { createJob } from '../../../lib/api';
import { getStoredAuth } from '../../../lib/auth';

const CATEGORIES = [
  { value: 'Plumbing', icon: '🔧' },
  { value: 'Electrical', icon: '⚡' },
  { value: 'Painting', icon: '🎨' },
  { value: 'Joinery', icon: '🪚' },
  { value: 'Other', icon: '🔨' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactName: '',
    contactEmail: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const syncAuth = () => {
      setAuth(getStoredAuth());
      setAuthChecked(true);
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-change', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-change', syncAuth);
    };
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = 'Title is required';
    if (!form.description.trim()) nextErrors.description = 'Description is required';
    if (form.contactEmail && !EMAIL_REGEX.test(form.contactEmail)) {
      nextErrors.contactEmail = 'Enter a valid email address';
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      await createJob(form);
      router.push('/');
    } catch (error) {
      setServerError(error.message || 'Failed to create job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `soft-input ${errors[field] ? 'border-rose-300 bg-rose-50' : ''}`;

  if (authChecked && !auth) {
    return (
      <div className="mx-auto max-w-3xl animate-fade-up">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-white"
        >
          ← Back to jobs
        </Link>

        <div className="glass-panel-strong px-6 py-8 text-center sm:px-8">
          <p className="section-label mb-3">Post a job</p>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">Sign in to continue</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
            You need an account to post and manage requests.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/auth?next=/jobs/new" className="primary-button">
              Sign In or Register
            </Link>
            <Link href="/" className="secondary-button">
              Back to jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-white"
      >
        ← Back to jobs
      </Link>

      <div className="glass-panel-strong overflow-hidden">
        <div className="border-b border-slate-200/60 bg-white/45 px-6 py-6 sm:px-8">
          <p className="section-label mb-2">New request</p>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">Post a job</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {auth?.user?.name
              ? `Signed in as ${auth.user.name}. Add the details below and publish.`
              : 'Add the details below and publish your request.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
          {serverError && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/90 px-4 py-4 text-sm text-rose-700 animate-fade-in">
              {serverError}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Leaking kitchen tap"
              className={inputClass('title')}
            />
            {errors.title && <p className="mt-2 text-xs text-rose-600">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="What needs to be done? Add any useful details."
              className={`${inputClass('description')} resize-none leading-relaxed`}
            />
            {errors.description && <p className="mt-2 text-xs text-rose-600">{errors.description}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ value, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, category: value }))}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    form.category === value
                      ? 'border-teal-700 bg-teal-700 text-white shadow-md'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:border-teal-300 hover:text-teal-700'
                  }`}
                >
                  {icon} {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Glasgow"
              className={inputClass('location')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Your name</label>
              <input
                type="text"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Jane Smith"
                className={inputClass('contactName')}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="jane@example.com"
                className={inputClass('contactEmail')}
              />
              {errors.contactEmail && <p className="mt-2 text-xs text-rose-600">{errors.contactEmail}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="submit" disabled={submitting} className="primary-button flex-1 justify-center">
              {submitting ? (
                <>
                  <span className="inline-block animate-spin">↻</span> Posting…
                </>
              ) : (
                'Post Job'
              )}
            </button>
            <Link href="/" className="secondary-button justify-center sm:px-6">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
