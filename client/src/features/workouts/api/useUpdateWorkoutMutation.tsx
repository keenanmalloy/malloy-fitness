import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const updateWorkout = async ({ id, workout }) => {
  const { data } = await apiClient.put(`/workouts/${id}`, workout);
  return data;
};

export const useUpdateWorkoutMutation = (id) => {
  return useMutation(({ workout }) => updateWorkout({ id, workout }));
};
