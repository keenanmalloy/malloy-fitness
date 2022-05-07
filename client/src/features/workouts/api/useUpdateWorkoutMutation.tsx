import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';
import { EditableWorkoutFields } from '../types';

interface UpdateWorkoutParams {
  id: string;
  workout: EditableWorkoutFields;
}

const updateWorkout = async ({ id, workout }: UpdateWorkoutParams) => {
  const { data } = await apiClient.put(`/workouts/${id}`, workout);
  return data;
};

export const useUpdateWorkoutMutation = (id: string) => {
  return useMutation<any, any, { workout: EditableWorkoutFields }>(
    ({ workout }) => updateWorkout({ id, workout })
  );
};
