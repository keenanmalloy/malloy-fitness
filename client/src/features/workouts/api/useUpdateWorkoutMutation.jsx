import { useMutation } from 'react-query';

const updateWorkout = async ({ id, workout }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useUpdateWorkoutMutation = (id) => {
  return useMutation(({ workout }) => updateWorkout({ id, workout }));
};
