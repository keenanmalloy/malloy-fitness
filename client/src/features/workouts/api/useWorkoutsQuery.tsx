import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetWorkoutsReponse } from '../types';

interface FetchWorkoutsParams {
  view?: string;
  type?: string;
  category?: string;
  sortBy?: string;
}

const fetchWorkouts = async ({
  view,
  type,
  category,
  sortBy,
}: FetchWorkoutsParams) => {
  const { data } = await apiClient.get(
    `/workouts/?category=${category ?? ''}&type=${type ?? ''}&view=${
      view ?? ''
    }&sortBy=${sortBy ?? ''}`
  );

  return data;
};

export const useWorkoutsQuery = ({
  view,
  type,
  category,
  sortBy,
}: FetchWorkoutsParams) => {
  return useQuery<GetWorkoutsReponse>(
    ['fetchWorkouts', view, type, category, sortBy],
    () => fetchWorkouts({ view, type, category, sortBy })
  );
};

const fetchFutureWorkouts = async () => {
  const { data } = await apiClient.get(`/workouts/?date=future`);
  return data;
};

export const useFutureWorkoutsQuery = () => {
  return useQuery<GetWorkoutsReponse>(
    'fetchFutureWorkouts',
    fetchFutureWorkouts
  );
};
