import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetWorkoutResponse } from '../types';

const fetchWorkout = async (id: string) => {
  const { data } = await apiClient.get(`/workouts/${id}`);
  return data;
};

export const useWorkoutQuery = (id: string) => {
  return useQuery<GetWorkoutResponse>(
    ['fetchWorkout', id],
    () => fetchWorkout(id),
    {
      enabled: !!id,
    }
  );
};
