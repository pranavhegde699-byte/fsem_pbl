export const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = async (endpoint, options = {}) => {
  const url = `${getApiUrl()}${endpoint}`;
  const token = localStorage.getItem('workproof_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (token) {
        localStorage.removeItem('workproof_token');
        localStorage.removeItem('workproof_worker_id');
        localStorage.removeItem('workproof_worker_name');
        window.location.href = '/login';
      }
    }
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return { data };
};
