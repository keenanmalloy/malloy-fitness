import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchExercise = async ({ id }) => {
  const { data } = await apiClient.get(`/exercises/${id}`);
  return data;
};

export const useExerciseQuery = (id) => {
  return useQuery(['fetchExercise', id], () => fetchExercise({ id }));
};
