import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface RotateExerciseParams {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
  workoutTaskId: string;
  workoutTaskExerciseId: string;
}

const rotateExercise = async ({
  workoutId,
  sessionId,
  exerciseId,
  workoutTaskId,
  workoutTaskExerciseId,
}: RotateExerciseParams) => {
  const { data } = await apiClient.put(
    `/sessions/${sessionId}/exercises/${exerciseId}`,
    {
      workoutId,
      workoutTaskId,
      workoutTaskExerciseId,
    }
  );
  return data;
};

interface Props {
  exerciseId: string;
  sessionId: string;
}

export const useRotateExercise = ({ sessionId, exerciseId }: Props) => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    any,
    { workoutId: string; workoutTaskId: string; workoutTaskExerciseId: string }
  >(
    ({ workoutId, workoutTaskId, workoutTaskExerciseId }) =>
      rotateExercise({
        workoutId,
        sessionId,
        exerciseId,
        workoutTaskId,
        workoutTaskExerciseId,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSessionTask');
      },
    }
  );
};
