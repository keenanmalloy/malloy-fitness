import { useQuery } from 'react-query';

const fetchWorkouts = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/`,
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

export const useWorkoutsQuery = () => {
  return useQuery('fetchWorkouts', fetchWorkouts);
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
