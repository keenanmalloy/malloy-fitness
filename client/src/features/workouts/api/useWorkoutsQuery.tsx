import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchWorkouts = async ({ view, type, category, sortBy }) => {
  const { data } = await apiClient.get(
    `/workouts/?category=${category ?? ''}&type=${type ?? ''}&view=${
      view ?? ''
    }&sortBy=${sortBy ?? ''}`
  );

  return data;
};

export const useWorkoutsQuery = ({ view, type, category, sortBy }) => {
  return useQuery(['fetchWorkouts', view, type, category, sortBy], () =>
    fetchWorkouts({ view, type, category, sortBy })
  );
};

const fetchFutureWorkouts = async () => {
  const { data } = await apiClient.get(`/workouts/?date=future`);
  return data;
};

export const useFutureWorkoutsQuery = () => {
  return useQuery('fetchFutureWorkouts', fetchFutureWorkouts);
};
