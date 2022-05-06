import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const cloneWorkout = async ({ id }) => {
  const { data } = await apiClient.post(`/workouts/${id}/copy`);
  return data;
};

export const useCloneWorkoutMutation = (id) => {
  return useMutation(() => {
    return cloneWorkout({ id });
  });
};
