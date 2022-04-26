import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchSession = async ({ id }) => {
  const { data } = await apiClient.get(`/sessions/${id}`);
  return data;
};

export const useSessionQuery = (id) => {
  return useQuery(['fetchSession', id], () => fetchSession({ id }), {
    enabled: !!id,
  });
};
