import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const deleteWorkout = async (id: string) => {
  const { data } = await apiClient.delete(`/workouts/${id}`);
  return data;
};

export const useDeleteWorkoutMutation = (id: string) => {
  return useMutation(() => {
    return deleteWorkout(id);
  });
};
