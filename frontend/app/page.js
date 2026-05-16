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

  return (
    <div className="space-y-8">
      <section className="w-full">
        <div className="glass-panel-strong motion-card animate-fade-up relative w-full overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-teal-300/25 blur-3xl animate-drift" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-amber-200/30 blur-3xl animate-soft-pulse" />
          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <p className="section-label mb-3">Home services, made simple</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.02] text-slate-900 sm:text-5xl lg:text-[3.45rem]">
              Post a job in minutes and connect with trusted tradespeople near you.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-600 sm:text-base">
              Post the work, filter open requests, and move quickly without extra steps.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-medium text-slate-600 animate-fade-up stagger-in" style={{ '--delay': '90ms' }}>
              <span className="rounded-full bg-white/80 px-3 py-1.5 shadow-sm">Fast to post</span>
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm">Easy to browse</span>
              <span className="rounded-full bg-white/70 px-3 py-1.5 shadow-sm">Built for local jobs</span>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3 animate-fade-up stagger-in" style={{ '--delay': '120ms' }}>
              <Link href="/jobs/new" className="primary-button">
                ＋ Start a New Request
              </Link>
              <a href="#job-board" className="secondary-button motion-chip">
                Browse Open Jobs
              </a>
            </div>
            <div className="mt-7 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
              Search by keyword, filter by trade, and open the full request in one click.
            </div>
          </div>
        </div>
      </section>

      <section
        id="job-board"
        className="glass-panel motion-card animate-fade-up stagger-in px-5 py-5 sm:px-6 sm:py-6"
        style={{ '--delay': '140ms' }}
      >
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
                    className={`motion-chip rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
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

            <button onClick={loadJobs} disabled={loading} className="secondary-button motion-chip self-end whitespace-nowrap">
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
                className={`motion-chip rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
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
        <div className="glass-panel motion-card py-16 text-center animate-fade-up">
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
                className="group block animate-fade-in stagger-in"
                style={{ '--delay': `${index * 45}ms` }}
              >
                <div
                  className={`glass-panel motion-card border-l-4 h-full overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] ${
                    STATUS_LEFT[job.status] || 'border-l-gray-300'
                  }`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
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
