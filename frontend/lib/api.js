import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function buildAuthHeaders() {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function getJobs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.status) params.set('status', filters.status);
  if (filters.q) params.set('q', filters.q);

  const res = await fetch(`${API_URL}/api/jobs?${params.toString()}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function getJob(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function createJob(data) {
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(),
  });
  return handleResponse(res);
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
