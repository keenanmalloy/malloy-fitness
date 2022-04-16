import { useQuery } from 'react-query';

const fetchWorkouts = async ({ activity, type, category, sortBy }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/?category=${category}&type=${type}&activity=${activity}&sortBy=${sortBy}`,
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

export const useWorkoutsQuery = ({ activity, type, category, sortBy }) => {
  return useQuery(['fetchWorkouts', activity, type, category, sortBy], () =>
    fetchWorkouts({ activity, type, category, sortBy })
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
