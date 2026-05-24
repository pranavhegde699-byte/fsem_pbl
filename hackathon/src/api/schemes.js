import { apiClient } from './client';

export const getMatchedSchemes = async (id) => {
  const res = await apiClient(`/schemes/match/${id}`);
  return { data: res.data }; // backend returns { matched_schemes: [] } inside data
};
