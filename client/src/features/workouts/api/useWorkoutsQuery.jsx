import { useQuery } from 'react-query';

const fetchWorkouts = async ({ view, type, category, sortBy }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/?category=${
        category ?? ''
      }&type=${type ?? ''}&view=${view ?? ''}&sortBy=${sortBy ?? ''}`,
      {
        credentials: 'include',
      }
    );
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(error);
  }
};

export const useWorkoutsQuery = ({ view, type, category, sortBy }) => {
  return useQuery(['fetchWorkouts', view, type, category, sortBy], () =>
    fetchWorkouts({ view, type, category, sortBy })
  );
};

const fetchFutureWorkouts = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/?date=future`,
      {
        credentials: 'include',
      }
    );
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(error);
  }
};

export const useFutureWorkoutsQuery = () => {
  return useQuery('fetchFutureWorkouts', fetchFutureWorkouts);
};
