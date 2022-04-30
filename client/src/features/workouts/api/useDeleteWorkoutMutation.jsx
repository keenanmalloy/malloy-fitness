import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const deleteWorkout = async ({ id }) => {
  const { data } = await apiClient.delete(`/workouts/${id}`);
  return data;
};

export const useDeleteWorkoutMutation = (id) => {
  return useMutation(() => {
    return deleteWorkout({ id });
  });
};
