import { apiClient } from './client';

export const registerWorker = async (data) => {
  const res = await apiClient('/workers/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { data: res.data };
};

export const loginWorker = async (data) => {
  const res = await apiClient('/workers/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { data: res.data };
};

export const getWorker = async (id) => {
  const res = await apiClient(`/workers/${id}`);
  return { data: res.data.worker };
};

export const updateWorker = async (id, data) => {
  const res = await apiClient(`/workers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return { data: res.data.worker };
};
