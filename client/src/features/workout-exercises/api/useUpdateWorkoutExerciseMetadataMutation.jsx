import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const updateWorkoutExerciseMetadata = async ({
  workoutId,
  exerciseId,
  body,
}) => {
  const { data } = await apiClient.patch(
    `/workouts/${workoutId}/exercises/${exerciseId}`,
    body
  );
  return data;
};

export const useUpdateWorkoutExerciseMetadataMutation = ({
  workoutId,
  exerciseId,
}) => {
  return useMutation((body) =>
    updateWorkoutExerciseMetadata({ workoutId, exerciseId, body })
  );
};
