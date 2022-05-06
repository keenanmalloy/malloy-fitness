import { apiClient } from 'config/axios';
import { useMutation } from 'react-query';

const updateWorkoutExercise = async ({ workoutId, exerciseId, payload }) => {
  const { data } = await apiClient.put(
    `/workouts/${workoutId}/exercises/${exerciseId}/`,
    payload
  );
  return data;
};

export const useUpdateWorkoutExerciseMutation = (workoutId, exerciseId) => {
  return useMutation((data) => {
    return updateWorkoutExercise({ workoutId, exerciseId, payload: data });
  });
};
