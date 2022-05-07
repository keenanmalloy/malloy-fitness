import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetSessionResponse } from 'features/sessions/types';

const fetchWorkoutSession = async (id: string) => {
  const { data } = await apiClient.get(`/sessions/${id}`);
  return data;
};

export const useWorkoutSessionQuery = (id: string) => {
  return useQuery<GetSessionResponse>(['fetchWorkoutSession'], () =>
    fetchWorkoutSession(id)
  );
};
