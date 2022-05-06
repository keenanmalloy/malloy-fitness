import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchWorkout = async ({ id }) => {
  const { data } = await apiClient.get(`/workouts/${id}`);
  return data;
};

export const useWorkoutQuery = (id) => {
  return useQuery(['fetchWorkout', id], () => fetchWorkout({ id }), {
    enabled: !!id,
  });
};
