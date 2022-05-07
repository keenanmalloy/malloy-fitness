import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchWorkoutSession = async (id: string) => {
  const { data } = await apiClient.get(`/sessions/${id}`);
  return data;
};

export const useWorkoutSessionQuery = (id: string) => {
  return useQuery(['fetchWorkoutSession'], () => fetchWorkoutSession(id));
};
