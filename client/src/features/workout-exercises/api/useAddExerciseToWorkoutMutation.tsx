import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface AddExerciseToWorkoutParams {
  workoutId: string;
  payload: any;
}

const addExerciseToWorkout = async ({
  workoutId,
  payload,
}: AddExerciseToWorkoutParams) => {
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
