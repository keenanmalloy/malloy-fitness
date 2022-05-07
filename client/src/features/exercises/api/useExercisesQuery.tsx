import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetExercisesResponse } from '../types';

interface FetchExercisesQueryParams {
  query?: string;
  category?: string;
  view?: string;
  profile?: string;
  sortBy?: string;
}

const fetchExercises = async ({
  query,
  category,
  view,
  profile,
  sortBy,
}: FetchExercisesQueryParams) => {
  const { data } = await apiClient.get(
    `/exercises/?q=${query ?? ''}&category=${category ?? ''}&view=${
      view ?? ''
    }&profile=${profile ?? ''}&sortBy=${sortBy ?? ''}`
  );

  return data;
};

export const useExercisesQuery = ({
  query,
  category,
  view,
  profile,
  sortBy,
}: FetchExercisesQueryParams) => {
  return useQuery<GetExercisesResponse, any>(
    ['fetchExercises', query, category, view, profile, sortBy],
    () => fetchExercises({ query, category, view, profile, sortBy })
  );
};
