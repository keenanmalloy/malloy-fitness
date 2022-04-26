import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const deleteExercise = async ({ id }) => {
  const { data } = await apiClient.delete(`/exercises/${id}`);
  return data;
};

export const useDeleteExerciseMutation = (id) => {
  return useMutation(() => {
    return deleteExercise({ id });
  });
};
