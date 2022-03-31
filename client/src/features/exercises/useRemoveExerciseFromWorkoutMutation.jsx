import { useMutation } from 'react-query';

const removeExerciseFromWorkout = async ({ workoutId, exerciseId }) => {
  const res = await fetch(
    `http://localhost:4000/workouts/${workoutId}/exercises/${exerciseId}`,
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
