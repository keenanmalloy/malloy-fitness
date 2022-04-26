import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchExercises = async (ids) => {
  const { data } = await apiClient.get(`/exercises/?mgIds=${ids.join(',')}`);
  return data;
};

export const useRelatedExercisesQuery = (ids) => {
  return useQuery(['fetchExerciseByIds', ids], () => fetchExercises(ids), {
    refetchOnWindowFocus: false,
  });
};
