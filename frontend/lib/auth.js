const AUTH_STORAGE_KEY = 'globaltna-auth';

function parseStoredAuth(value) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || !parsed.token) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getStoredAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  return parseStoredAuth(window.localStorage.getItem(AUTH_STORAGE_KEY));
}

export function getAuthToken() {
  return getStoredAuth()?.token || '';
}

export function storeAuth(auth) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  window.dispatchEvent(new Event('auth-change'));
}

export function clearAuth() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event('auth-change'));
}