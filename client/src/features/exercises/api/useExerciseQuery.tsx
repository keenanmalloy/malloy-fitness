import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetSingleExerciseResponse } from '../types';

const fetchExercise = async (id: string) => {
  const { data } = await apiClient.get(`/exercises/${id}`);
  return data;
};

export const useExerciseQuery = (id: string) => {
  return useQuery<GetSingleExerciseResponse>(['fetchExercise', id], () =>
    fetchExercise(id)
  );
};
