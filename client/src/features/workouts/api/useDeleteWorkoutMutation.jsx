import { useMutation } from 'react-query';

const deleteWorkout = async ({ id }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useDeleteWorkoutMutation = (id) => {
  return useMutation(() => {
    return deleteWorkout({ id });
  });
};
