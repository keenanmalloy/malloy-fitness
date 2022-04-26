import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const createWorkout = async ({ workout }) => {
  const { data } = await apiClient.post(`/workouts`, {
    workout,
  });
  return data;
};

export const useCreateWorkoutMutation = () => {
  return useMutation(createWorkout);
};
