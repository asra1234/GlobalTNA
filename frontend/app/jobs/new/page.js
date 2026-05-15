'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.contactEmail && !EMAIL_REGEX.test(form.contactEmail)) {
      e.contactEmail = 'Enter a valid email address';
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setServerError(err.message || 'Failed to create job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = 'soft-input';
  const inputClass = (field) =>
    `${inputBase} ${errors[field] ? 'border-rose-300 bg-rose-50' : ''}`;

  if (authChecked && !auth) {
    return (
      <div className="mx-auto max-w-4xl animate-fade-up">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-white"
        >
          ← Back to jobs
        </Link>

        <div className="glass-panel-strong overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 px-6 py-8 text-white sm:px-8">
              <p className="section-label mb-3 text-teal-100/80">Authentication</p>
              <h1 className="text-4xl font-extrabold leading-tight">Sign in to post a job</h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-teal-50/85">
                Protected posting keeps requests cleaner and gives you a smoother follow-up flow later.
              </p>
            </div>
            <div className="px-6 py-8 sm:px-8">
              <div className="rounded-3xl bg-teal-50 px-5 py-5 text-sm leading-7 text-slate-600">
                Posting requests is restricted to authenticated users.
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/auth?next=/jobs/new" className="primary-button">
                  Sign In or Register
                </Link>
                <Link href="/" className="secondary-button">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl animate-fade-up">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-white"
      >
        ← Back to jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="space-y-6">
          <section className="glass-panel-strong relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="relative">
              <p className="section-label mb-3">New request</p>
              <h1 className="text-4xl font-extrabold leading-tight text-slate-900">Post work that gets clear responses.</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {auth?.user?.name
                  ? `Signed in as ${auth.user.name}. Add the essentials and local tradespeople can understand the job at a glance.`
                  : 'Describe the problem clearly and make it easy for tradespeople to respond with confidence.'}
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-white/80 px-4 py-4 shadow-sm animate-fade-up" style={{ animationDelay: '80ms' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Be specific</p>
                  <p className="mt-2 text-sm text-slate-600">Mention the issue, urgency, and exact location details.</p>
                </div>
                <div className="rounded-3xl bg-amber-50 px-4 py-4 animate-fade-up" style={{ animationDelay: '140ms' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Choose a category</p>
                  <p className="mt-2 text-sm text-slate-600">Good categorisation helps the right people find the job faster.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel px-6 py-6">
            <p className="section-label mb-3">What good requests include</p>
            <ul className="space-y-3 text-sm leading-7 text-slate-600">
              <li>Clear title with the actual task or fault.</li>
              <li>Short description explaining urgency and access details.</li>
              <li>Location and contact information for follow-up.</li>
            </ul>
          </section>
        </aside>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {serverError && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/90 px-4 py-4 text-sm text-rose-700 animate-fade-in">
              {serverError}
            </div>
          )}

          <div className="glass-panel overflow-hidden">
            <div className="border-b border-slate-200/60 bg-white/50 px-6 py-4">
              <p className="section-label mb-1">Job details</p>
              <h2 className="text-lg font-bold text-slate-900">Describe the work</h2>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Need a plumber for a leaking kitchen tap in Glasgow"
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
                  placeholder="Describe the problem in as much detail as possible. Mention what is wrong, how urgent it is, and any access notes."
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
                      onClick={() => setForm((prev) => ({ ...prev, category: value }))}
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
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="border-b border-slate-200/60 bg-white/50 px-6 py-4">
              <p className="section-label mb-1">Contact</p>
              <h2 className="text-lg font-bold text-slate-900">Help the right person reach you</h2>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Glasgow, Edinburgh, London"
                  className={inputClass('location')}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Your Name</label>
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
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label>
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
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={submitting} className="primary-button flex-1">
              {submitting ? (
                <>
                  <span className="inline-block animate-spin">↻</span> Posting…
                </>
              ) : (
                <>✓ Post Request</>
              )}
            </button>
            <Link href="/" className="secondary-button sm:px-6">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
