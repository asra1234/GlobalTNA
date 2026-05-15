'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

import { getJobs } from '../lib/api';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];
const STATUSES = ['All', 'Open', 'In Progress', 'Closed'];

const STATUS_BADGE = {
  Open: 'bg-emerald-100 text-emerald-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Closed: 'bg-slate-100 text-slate-500',
};

const STATUS_DOT = {
  Open: 'bg-emerald-500',
  'In Progress': 'bg-amber-500',
  Closed: 'bg-slate-400',
};

const STATUS_LEFT = {
  Open: 'border-l-emerald-400',
  'In Progress': 'border-l-amber-400',
  Closed: 'border-l-slate-300',
};

const CATEGORY_ICONS = {
  All: '🗂️',
  Plumbing: '🔧',
  Electrical: '⚡',
  Painting: '🎨',
  Joinery: '🪚',
  Other: '🔨',
};

const STATUS_PILL_ACTIVE = {
  All: 'bg-slate-900 text-white shadow-sm',
  Open: 'bg-emerald-500 text-white shadow-sm',
  'In Progress': 'bg-amber-500 text-white shadow-sm',
  Closed: 'bg-slate-500 text-white shadow-sm',
};

function SkeletonCard() {
  return (
    <div className="glass-panel animate-pulse p-5">
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-gray-200" />
        <div className="h-6 w-20 rounded-full bg-gray-100" />
      </div>
      <div className="mb-2 h-5 w-3/4 rounded-lg bg-gray-200" />
      <div className="mb-1.5 h-4 rounded-lg bg-gray-100" />
      <div className="mb-1.5 h-4 w-5/6 rounded-lg bg-gray-100" />
      <div className="mb-4 h-4 w-2/3 rounded-lg bg-gray-100" />
      <div className="flex justify-between border-t border-slate-200/60 pt-3">
        <div className="h-3 w-24 rounded-lg bg-gray-100" />
        <div className="h-3 w-16 rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (categoryFilter !== 'All') filters.category = categoryFilter;
      if (statusFilter !== 'All') filters.status = statusFilter;
      if (searchTerm.trim()) filters.q = searchTerm.trim();
      const data = await getJobs(filters);
      setJobs(data);
    } catch {
      setError('Could not reach the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchTerm, statusFilter]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const openJobs = jobs.filter((job) => job.status === 'Open').length;
  const activeAreas = new Set(jobs.map((job) => job.location).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.14fr_0.86fr]">
        <div className="glass-panel-strong relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10 animate-fade-up">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-teal-300/25 blur-3xl animate-drift" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-amber-200/30 blur-3xl animate-soft-pulse" />
          <div className="relative z-10 max-w-2xl">
            <p className="section-label mb-3">Service marketplace</p>
            <h1 className="text-4xl font-extrabold leading-[1.05] text-slate-900 sm:text-5xl">
              Find reliable tradespeople without the messy back-and-forth.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-slate-600">
              Post a request, filter live opportunities, and keep the whole process calm, clear, and easy to scan.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/jobs/new" className="primary-button animate-sheen">
                ＋ Post a Job Request
              </Link>
              <a href="#job-board" className="secondary-button">
                Explore the Job Board
              </a>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/85 px-4 py-4 shadow-sm animate-fade-up" style={{ animationDelay: '60ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Live filters</p>
                <p className="mt-2 text-sm text-slate-600">Search by keywords, category, and status in one place.</p>
              </div>
              <div className="rounded-3xl bg-amber-50 px-4 py-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Fast posting</p>
                <p className="mt-2 text-sm text-slate-600">Create polished job requests in a guided workflow.</p>
              </div>
              <div className="rounded-3xl bg-teal-50 px-4 py-4 animate-fade-up" style={{ animationDelay: '180ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Secure actions</p>
                <p className="mt-2 text-sm text-slate-600">Authenticated posting and deletion with cleaner control.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between px-6 py-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div>
            <p className="section-label mb-3">At a glance</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-white/80 px-5 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Open requests</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-900">{openJobs}</p>
                <p className="mt-2 text-sm text-slate-500">Fresh work currently waiting for responses.</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-teal-700 to-slate-900 px-5 py-5 text-white shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">Coverage</p>
                <p className="mt-3 text-3xl font-extrabold">{activeAreas || 0} areas</p>
                <p className="mt-2 text-sm text-teal-50/80">Locations represented on the current board.</p>
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-3xl bg-amber-50 px-5 py-5 text-sm leading-7 text-slate-600">
            Tip: start with keyword search, then narrow with category and status to get to the right request quickly.
          </div>
        </div>
      </section>

      <section id="job-board" className="glass-panel px-5 py-5 sm:px-6 sm:py-6 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <label htmlFor="job-keyword-search" className="section-label mb-2 block">
              Keyword Search
            </label>
            <input
              id="job-keyword-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title or description"
              className="soft-input"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="section-label mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                      statusFilter === status
                        ? STATUS_PILL_ACTIVE[status]
                        : 'border-slate-200 bg-white/75 text-slate-600 hover:border-teal-300 hover:text-teal-700'
                    }`}
                  >
                    {status !== 'All' && (
                      <span className={`mr-2 inline-block h-2 w-2 rounded-full ${STATUS_DOT[status] || 'bg-gray-400'}`} />
                    )}
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={loadJobs} disabled={loading} className="secondary-button self-end whitespace-nowrap">
              <span className={loading ? 'inline-block animate-spin' : ''}>↻</span> Refresh
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="section-label mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  categoryFilter === category
                    ? 'border-teal-700 bg-teal-700 text-white shadow-md'
                    : 'border-slate-200 bg-white/75 text-slate-600 hover:border-teal-300 hover:text-teal-700'
                }`}
              >
                <span className="mr-2">{CATEGORY_ICONS[category]}</span>
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {!loading && error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/90 px-4 py-4 text-sm text-rose-700 animate-fade-in">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="glass-panel py-16 text-center animate-fade-up">
          <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-4xl animate-soft-pulse">
            📋
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800">No job requests found</h2>
          <p className="mx-auto mb-7 max-w-md text-sm leading-7 text-slate-500">
            Try adjusting your filters or search terms, or be the first to post a request.
          </p>
          <Link href="/jobs/new" className="primary-button">
            ＋ Post a Job
          </Link>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <p className="section-label mb-4">
            {jobs.length} request{jobs.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="group block animate-fade-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div
                  className={`glass-panel border-l-4 h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] ${
                    STATUS_LEFT[job.status] || 'border-l-gray-300'
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_BADGE[job.status] || 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[job.status] || 'bg-gray-400'}`} />
                      {job.status}
                    </span>
                    {job.category && (
                      <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs text-slate-500 shadow-sm">
                        {CATEGORY_ICONS[job.category]} {job.category}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-teal-700">
                    {job.title}
                  </h3>

                  <p className="mb-4 line-clamp-3 text-sm leading-7 text-slate-500">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span>📍</span>
                      {job.location || 'Location not set'}
                    </span>
                    <span>{new Date(job.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
