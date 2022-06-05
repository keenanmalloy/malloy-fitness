import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

interface UpdateWorkoutParams {
  id: string;
  workout?: any;
}

const updateWorkout = async ({ id, workout }: UpdateWorkoutParams) => {
  const { data } = await apiClient.put(`/workouts/${id}`, workout);
  return data;
};

export const useUpdateWorkoutMutation = (id: string) => {
  return useMutation<any, any, { workout: any }>(({ workout }) =>
    updateWorkout({ id, workout })
  );
};
