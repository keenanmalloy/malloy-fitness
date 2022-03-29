import { useMutation } from 'react-query';

const createWorkout = async ({ workout }) => {
  const res = await fetch('http://localhost:4000/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
    credentials: 'include',
  });
  const json = await res.json();
  return json;
};

export const useCreateWorkoutMutation = () => {
  return useMutation(createWorkout);
};
