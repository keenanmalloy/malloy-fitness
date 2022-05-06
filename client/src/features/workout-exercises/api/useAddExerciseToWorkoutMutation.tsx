import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const addExerciseToWorkout = async ({ workoutId, payload }) => {
  const { data } = await apiClient.post(
    `/workouts/${workoutId}/exercises/`,
    payload
  );
  return data;
};

export const useAddExerciseToWorkoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addExerciseToWorkout, {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchWorkout');
    },
  });
};
