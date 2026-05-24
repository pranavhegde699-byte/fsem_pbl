import { apiClient } from './client';

export const generateDocument = async (id, language, scoreId) => {
  const res = await apiClient(`/documents/generate/${id}`, {
    method: 'POST',
    body: JSON.stringify({ language, scoreId })
  });
  return { data: res.data.document };
};

export const getLatestDocument = async (id) => {
  const res = await apiClient(`/documents/${id}/latest`);
  return { data: res.data.document };
};
