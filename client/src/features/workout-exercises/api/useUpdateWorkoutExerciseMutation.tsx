import { apiClient } from 'config/axios';
import { useMutation } from 'react-query';
interface UpdateWorkoutExerciseMutationProps {
  workoutId: string;
  exerciseId: string;
  payload: {
    order?: number;
  };
}
const updateWorkoutExercise = async ({
  workoutId,
  exerciseId,
  payload,
}: UpdateWorkoutExerciseMutationProps) => {
  const { data } = await apiClient.put(
    `/workouts/${workoutId}/exercises/${exerciseId}/`,
    payload
  );
  return data;
};

export const useUpdateWorkoutExerciseMutation = (
  workoutId: string,
  exerciseId: string
) => {
  return useMutation<any, any, { order: number }>((data) => {
    return updateWorkoutExercise({ workoutId, exerciseId, payload: data });
  });
};
