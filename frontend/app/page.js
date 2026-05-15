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
  All: 'bg-blue-600 text-white shadow-sm',
  Open: 'bg-emerald-500 text-white shadow-sm',
  'In Progress': 'bg-amber-500 text-white shadow-sm',
  Closed: 'bg-slate-500 text-white shadow-sm',
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="h-5 bg-gray-200 rounded-lg mb-2 w-3/4" />
      <div className="h-4 bg-gray-100 rounded-lg mb-1.5" />
      <div className="h-4 bg-gray-100 rounded-lg mb-1.5 w-5/6" />
      <div className="h-4 bg-gray-100 rounded-lg mb-4 w-2/3" />
      <div className="flex justify-between pt-3 border-t border-gray-100">
        <div className="h-3 w-24 bg-gray-100 rounded-lg" />
        <div className="h-3 w-16 bg-gray-100 rounded-lg" />
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

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (categoryFilter !== 'All') filters.category = categoryFilter;
      if (statusFilter !== 'All') filters.status = statusFilter;
      const data = await getJobs(filters);
      setJobs(data);
    } catch {
      setError('Could not reach the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <div>
      {/* â”€â”€ Hero banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-10 mb-8 text-white shadow-xl">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-xl">
          <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-2">
            Service Marketplace
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
            Find Trusted<br />Tradespeople
          </h1>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Post a job request in seconds and get connected with skilled local tradespeople — plumbers, electricians, painters, and more.
          </p>
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors shadow-lg"
          >
            <span>＋</span> Post a Job Request
          </Link>
        </div>
      </div>

      {/* â”€â”€ Filters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 space-y-4">
        {/* Category pills */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === c
                    ? (STATUS_PILL_ACTIVE.All)   // reuse blue for category active
                      .replace('bg-blue-600', 'bg-blue-600') + ''
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700'
                } ${categoryFilter === c ? 'bg-blue-600 text-white shadow-sm' : ''}`}
              >
                <span>{CATEGORY_ICONS[c]}</span>
                <span>{c === 'All' ? 'All' : c}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status pills + refresh */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === s
                      ? STATUS_PILL_ACTIVE[s]
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {s !== 'All' && (
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s] || 'bg-gray-400'}`} />
                  )}
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={loadJobs}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-600 disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>↻</span> Refresh
          </button>
        </div>
      </div>

      {/* â”€â”€ Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl mb-6">
          <span className="text-lg">⚠️</span>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* â”€â”€ Loading: skeleton grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* â”€â”€ Empty state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-4xl mb-5">
            📋
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No job requests found</h2>
          <p className="text-sm text-gray-400 mb-7">
            Try adjusting your filters, or be the first to post a request.
          </p>
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <span>＋</span> Post a Job
          </Link>
        </div>
      )}

      {/* â”€â”€ Job cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {jobs.length} request{jobs.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="group block animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${
                    STATUS_LEFT[job.status] || 'border-l-gray-300'
                  } p-5 h-full flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                >
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        STATUS_BADGE[job.status] || 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[job.status] || 'bg-gray-400'}`}
                      />
                      {job.status}
                    </span>
                    {job.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {CATEGORY_ICONS[job.category]} {job.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {job.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
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
