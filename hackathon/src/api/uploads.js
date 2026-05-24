import { getApiUrl } from './client';

export const uploadUpiPdf = async (file) => {
  const url = `${getApiUrl()}/uploads/upi-pdf`;
  const token = localStorage.getItem('workproof_token');

  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      // Do NOT set Content-Type here; browser will set it with boundary automatically for FormData
    },
    body: formData,
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
    const errorMsg = data.error || data.message || `Upload failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return { data };
};
