import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const updateExercise = async ({ id, exercise }) => {
  const { data } = await apiClient.put(`/exercises/${id}`, exercise);
  return data;
};

export const useUpdateExerciseMutation = (id) => {
  return useMutation(({ exercise }) => updateExercise({ id, exercise }));
};
