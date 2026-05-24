import { apiClient } from './client';

export const getLatestScore = async (id) => {
  const res = await apiClient(`/scores/${id}/latest`);
  return { data: res.data.score };
};

export const calculateScore = async (id) => {
  const res = await apiClient(`/scores/calculate/${id}`, {
    method: 'POST',
  });
  return { data: res.data.score };
};
