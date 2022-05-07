import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const cloneWorkout = async (id: string) => {
  const { data } = await apiClient.post(`/workouts/${id}/copy`);
  return data;
};

export const useCloneWorkoutMutation = (id: string) => {
  return useMutation(() => {
    return cloneWorkout(id);
  });
};
