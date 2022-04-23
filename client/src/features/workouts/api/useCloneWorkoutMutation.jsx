import { useMutation } from 'react-query';

const cloneWorkout = async ({ id }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}/copy`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useCloneWorkoutMutation = (id) => {
  return useMutation(() => {
    return cloneWorkout({ id });
  });
};
