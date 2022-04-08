import { useMutation, useQueryClient } from 'react-query';

const addExerciseToWorkout = async ({ workoutId, payload }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${workoutId}/exercises/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useAddExerciseToWorkoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addExerciseToWorkout, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchWorkout');
    },
  });
};
