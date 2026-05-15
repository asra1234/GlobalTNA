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
      <div className="max-w-2xl mx-auto">
        <div className="h-4 w-24 bg-gray-200 rounded-lg animate-pulse mb-6" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div className="h-24 bg-gray-200" />
          <div className="p-6 space-y-3">
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
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4">
          ← Back to jobs
        </Link>
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-2xl">
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

  // â”€â”€ Detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-5"
      >
        ← Back to jobs
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* â”€â”€ Status-coloured header bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className={`bg-gradient-to-r ${headerGradient} px-6 py-5 text-white`}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
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
          <h1 className="text-xl font-extrabold leading-snug">{job.title}</h1>
        </div>

        {/* â”€â”€ Description â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-gray-700 leading-relaxed text-sm">{job.description}</p>
        </div>

        {/* â”€â”€ Info grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {(job.location || job.contactName || job.contactEmail) && (
          <div className="px-6 py-4 bg-slate-50/60 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {job.location && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                  📍 {job.location}
                </p>
              </div>
            )}
            {job.contactName && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Contact
                </p>
                <p className="text-sm font-medium text-gray-800">👤 {job.contactName}</p>
              </div>
            )}
            {job.contactEmail && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all flex items-center gap-1.5"
                >
                  ✉️ {job.contactEmail}
                </a>
              </div>
            )}
          </div>
        )}

        {/* â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="px-6 py-5 space-y-5">
          {actionError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3.5 py-3 rounded-xl text-sm">
              <span>⚠️</span> {actionError}
            </div>
          )}

          {justUpdated && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-3 rounded-xl text-sm animate-fade-in">
              <span>✓</span> Status updated successfully
            </div>
          )}

          {/* Status buttons */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => {
                const isCurrent = job.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isCurrent || updating}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all disabled:cursor-not-allowed ${
                      isCurrent
                        ? STATUS_BUTTON_ACTIVE[status]
                        : `${STATUS_BUTTON_IDLE[status]} disabled:opacity-40`
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
                    {status}
                    {isCurrent && <span className="text-xs opacity-75">(current)</span>}
                  </button>
                );
              })}
              {updating && (
                <span className="self-center text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="inline-block animate-spin">↻</span> Saving…
                </span>
              )}
            </div>
          </div>

          {/* Delete */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Permanent action — cannot be undone.</p>
            {auth ? (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-400 active:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all"
              >
                Sign in to delete
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
