import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const createWorkout = async (workout: any) => {
  const { data } = await apiClient.post(`/workouts`, workout);
  return data;
};

export const useCreateWorkoutMutation = () => {
  return useMutation<any, any, any>(createWorkout);
};
