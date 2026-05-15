'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createJob } from '../../../lib/api';

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

  const inputBase =
    'w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
  const inputClass = (field) =>
    `${inputBase} ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* â”€â”€ Page header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          ← Back to jobs
        </Link>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-7 text-white shadow-lg">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
              New Request
            </p>
            <h1 className="text-2xl font-extrabold mb-1">Post a Service Request</h1>
            <p className="text-blue-100 text-sm">
              Describe what you need done and we&apos;ll connect you with the right tradesperson.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* â”€â”€ Server error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {serverError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <span>⚠️</span> {serverError}
          </div>
        )}

        {/* â”€â”€ Section: Job Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-2">
            <span className="text-base">📋</span>
            <h2 className="text-sm font-semibold text-gray-700">Job Details</h2>
          </div>

          <div className="p-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Need a plumber for a leaking kitchen tap in Glasgow"
                className={inputClass('title')}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>●</span> {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the problem in as much detail as possible — what's wrong, how urgent it is, any access notes…"
                className={`${inputClass('description')} resize-none leading-relaxed`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>●</span> {errors.description}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ value, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, category: value }))}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      form.category === value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700'
                    }`}
                  >
                    {icon} {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* â”€â”€ Section: Location & Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-2">
            <span className="text-base">👤</span>
            <h2 className="text-sm font-semibold text-gray-700">Location &amp; Contact</h2>
          </div>

          <div className="p-5 space-y-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                📍 Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Glasgow, Edinburgh, London"
                className={inputClass('location')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className={inputClass('contactName')}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className={inputClass('contactEmail')}
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>●</span> {errors.contactEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* â”€â”€ Submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 active:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {submitting ? (
              <>
                <span className="inline-block animate-spin">↻</span> Posting…
              </>
            ) : (
              <>✓ Post Request</>
            )}
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
