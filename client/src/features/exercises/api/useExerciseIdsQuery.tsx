import { apiClient } from 'config/axios';
import { useQuery } from 'react-query';

const fetchExercises = async (ids: string[]) => {
  // fetch the data, the fetch call returns a promise of a response.
  // we await for the promise to resolve with the await keyword.
  const { data } = await apiClient.get(`/exercises/?ids=${ids.join(',')}`);

  // return the data that we got from the API.
  return data;
};

export const useExerciseIdsQuery = (ids: string[]) => {
  return useQuery(['fetchExerciseByIds', ids], () => fetchExercises(ids), {
    enabled: !!ids.length,
  });
};
