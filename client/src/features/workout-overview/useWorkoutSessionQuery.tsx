import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchWorkoutSession = async ({ id }) => {
  const { data } = await apiClient.get(`/sessions/${id}`);
  return data;
};

export const useWorkoutSessionQuery = (id) => {
  return useQuery(['fetchWorkoutSession'], () => fetchWorkoutSession({ id }));
};
