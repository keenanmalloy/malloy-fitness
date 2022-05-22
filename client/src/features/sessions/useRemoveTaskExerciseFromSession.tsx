import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface RemoveSessionTaskExerciseParams {
  workoutId: string;
  exerciseId: string;
  workoutTaskExerciseId: string;
  sessionId: string;
}

const removeTaskExercise = async ({
  workoutId,
  exerciseId,
  workoutTaskExerciseId,
  sessionId,
}: RemoveSessionTaskExerciseParams) => {
  const { data } = await apiClient.delete(
    `/sessions/${sessionId}/exercises/${exerciseId}?workoutId=${workoutId}&workoutTaskExerciseId=${workoutTaskExerciseId}`
  );
  return data;
};

export const useRemoveTaskExerciseFromSession = (
  sessionId: string,
  workoutId: string
) => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    any,
    { exerciseId: string; workoutTaskExerciseId: string }
  >(
    ({ exerciseId, workoutTaskExerciseId }) =>
      removeTaskExercise({
        workoutId,
        sessionId,
        exerciseId,
        workoutTaskExerciseId,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSession');
      },
    }
  );
};
