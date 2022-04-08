import { useMutation } from 'react-query';

const deleteWorkout = async ({ id }) => {
  const res = await fetch(`http://localhost:4000/workouts/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const json = await res.json();
  return json;
};

export const useDeleteWorkoutMutation = (id) => {
  return useMutation(() => {
    return deleteWorkout({ id });
  });
};
