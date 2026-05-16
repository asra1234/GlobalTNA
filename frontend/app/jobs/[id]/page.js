'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getJob, updateJobStatus, deleteJob } from '../../../lib/api';
import { getStoredAuth } from '../../../lib/auth';

const STATUSES = ['Open', 'In Progress', 'Closed'];

const STATUS_BADGE = {
  Open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
  Closed: 'bg-slate-100 text-slate-500 border-slate-200',
};

const STATUS_DOT = {
  Open: 'bg-emerald-500',
  'In Progress': 'bg-amber-500',
  Closed: 'bg-slate-400',
};

const STATUS_HEADER_GRADIENT = {
  Open: 'from-emerald-500 to-teal-600',
  'In Progress': 'from-amber-500 to-orange-500',
  Closed: 'from-slate-500 to-gray-600',
};

const STATUS_BUTTON_IDLE = {
  Open: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400',
  'In Progress': 'border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-400',
  Closed: 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-400',
};

const STATUS_BUTTON_ACTIVE = {
  Open: 'bg-emerald-500 text-white border-emerald-500 shadow-sm',
  'In Progress': 'bg-amber-500 text-white border-amber-500 shadow-sm',
  Closed: 'bg-slate-500 text-white border-slate-500 shadow-sm',
};

const CATEGORY_ICONS = {
  Plumbing: '🔧',
  Electrical: '⚡',
  Painting: '🎨',
  Joinery: '🪚',
  Other: '🔨',
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [justUpdated, setJustUpdated] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getJob(params.id);
        setJob(data);
      } catch {
        setError('Job not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

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

  const handleStatusChange = async (newStatus) => {
    if (newStatus === job.status || updating) return;
    setUpdating(true);
    setActionError('');
    setJustUpdated(false);
    try {
      const updated = await updateJobStatus(params.id, newStatus);
      setJob(updated);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);
    } catch (err) {
      setActionError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this job request? This action cannot be undone.')) return;
    setDeleting(true);
    setActionError('');
    try {
      await deleteJob(params.id);
      router.push('/');
    } catch (err) {
      setActionError(err.message || 'Failed to delete job');
      setDeleting(false);
    }
  };

  // â”€â”€ Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 h-10 w-36 rounded-full bg-white/70 animate-pulse" />
        <div className="glass-panel overflow-hidden animate-pulse">
          <div className="h-32 bg-slate-200/70" />
          <div className="space-y-3 p-6">
            <div className="h-7 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-4 bg-gray-100 rounded-lg" />
            <div className="h-4 bg-gray-100 rounded-lg w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (error) {
    return (
      <div className="mx-auto max-w-3xl animate-fade-up">
        <Link href="/" className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-white">
          ← Back to jobs
        </Link>
        <div className="glass-panel flex items-start gap-3 border-rose-200 bg-rose-50/80 px-4 py-4 text-rose-700">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold mb-0.5">Not Found</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const headerGradient = STATUS_HEADER_GRADIENT[job.status] || 'from-blue-600 to-indigo-700';

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-white"
      >
        ← Back to jobs
      </Link>

      <div className="space-y-6">
        <section className="glass-panel overflow-hidden">
          <div className={`relative overflow-hidden bg-gradient-to-r ${headerGradient} px-6 py-6 text-white sm:px-8`}>
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full border border-white/30"
              >
                <span className={`w-2 h-2 rounded-full bg-white`} />
                {job.status}
              </span>
              {job.category && (
                <span className="text-sm bg-white/15 px-3 py-1 rounded-full border border-white/20">
                  {CATEGORY_ICONS[job.category]} {job.category}
                </span>
              )}
              <span className="ml-auto text-xs opacity-75">
                Posted {new Date(job.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="max-w-2xl text-3xl font-extrabold leading-tight">{job.title}</h1>
          </div>

          <div className="border-b border-slate-200/60 px-6 py-6 sm:px-8">
            <p className="section-label mb-3">Overview</p>
            <p className="text-[15px] leading-8 text-slate-600">{job.description}</p>
          </div>

          {(job.location || job.contactName || job.contactEmail) && (
            <div className="grid grid-cols-1 gap-4 border-b border-slate-200/60 bg-white/45 px-6 py-5 sm:grid-cols-3 sm:px-8">
              {job.location && (
                <div className="rounded-3xl bg-white/70 px-4 py-4 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Location
                  </p>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                    📍 {job.location}
                  </p>
                </div>
              )}
              {job.contactName && (
                <div className="rounded-3xl bg-white/70 px-4 py-4 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Contact
                  </p>
                  <p className="text-sm font-medium text-slate-800">👤 {job.contactName}</p>
                </div>
              )}
              {job.contactEmail && (
                <div className="rounded-3xl bg-white/70 px-4 py-4 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${job.contactEmail}`}
                    className="flex items-center gap-1.5 break-all text-sm font-medium text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    ✉️ {job.contactEmail}
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="px-6 py-6 sm:px-8">
            <p className="section-label mb-3">Status controls</p>
            {actionError && (
              <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 animate-fade-in">
                {actionError}
              </div>
            )}

            {justUpdated && (
              <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-700 animate-fade-in">
                Status updated successfully
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => {
                const isCurrent = job.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isCurrent || updating}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed ${
                      isCurrent
                        ? STATUS_BUTTON_ACTIVE[status]
                        : `${STATUS_BUTTON_IDLE[status]} disabled:opacity-40 bg-white/75`
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
                    {status}
                  </button>
                );
              })}
              {updating && (
                <span className="self-center text-xs text-slate-400">
                  <span className="inline-block animate-spin">↻</span> Saving…
                </span>
              )}
            </div>
          </div>
          <div className="border-t border-slate-200/60 px-6 py-6 sm:px-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-label mb-1">Manage request</p>
                <p className="text-sm text-slate-500">Delete this request only if you no longer need it.</p>
              </div>
              <div className="rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-slate-600">
                {job.category || 'General'}
              </div>
            </div>
            {auth ? (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {deleting ? (
                  <><span className="inline-block animate-spin">↻</span> Deleting…</>
                ) : (
                  <>🗑 Delete Request</>
                )}
              </button>
            ) : (
              <Link
                href={`/auth?next=/jobs/${params.id}`}
                className="secondary-button w-full sm:w-auto"
              >
                Sign in to delete
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
