import { useMutation } from 'react-query';

const removeExerciseFromWorkout = async ({ workoutId, exerciseId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${workoutId}/exercises/${exerciseId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useRemoveExerciseFromWorkoutMutation = () => {
  return useMutation(removeExerciseFromWorkout);
};
