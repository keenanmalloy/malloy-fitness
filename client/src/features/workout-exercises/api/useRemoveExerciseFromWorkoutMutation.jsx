import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const removeExerciseFromWorkout = async ({ workoutId, exerciseId }) => {
  const { data } = await apiClient.delete(
    `/workouts/${workoutId}/exercises/${exerciseId}`
  );
  return data;
};

export const useRemoveExerciseFromWorkoutMutation = () => {
  return useMutation(removeExerciseFromWorkout);
};
