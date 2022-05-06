import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchExercises = async ({ query, category, view, profile, sortBy }) => {
  const { data } = await apiClient.get(
    `/exercises/?q=${query ?? ''}&category=${category ?? ''}&view=${
      view ?? ''
    }&profile=${profile ?? ''}&sortBy=${sortBy ?? ''}`,
    {
      credentials: 'include',
    }
  );

  return data;
};

export const useExercisesQuery = ({
  query,
  category,
  view,
  profile,
  sortBy,
}) => {
  return useQuery(
    ['fetchExercises', query, category, view, profile, sortBy],
    () => fetchExercises({ query, category, view, profile, sortBy })
  );
};
