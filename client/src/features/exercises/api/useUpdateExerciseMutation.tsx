import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';
import { Exercise } from '../types';

interface Params {
  id: string;
  exercise: Exercise;
}

const updateExercise = async ({ id, exercise }: Params) => {
  const { data } = await apiClient.put(`/exercises/${id}`, exercise);
  return data;
};

export const useUpdateExerciseMutation = (id: string) => {
  return useMutation<any, any, any>(({ exercise }) =>
    updateExercise({ id, exercise })
  );
};
