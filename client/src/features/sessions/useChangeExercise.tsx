import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface ChageExerciseParams {
  workoutId: string;
  sessionId: string;
  oldExerciseId: string;
  newExerciseId: string;
  workoutTaskId: string;
  currentWorkoutTaskExerciseId: string;
}

const changeExercise = async ({
  workoutId,
  sessionId,
  oldExerciseId,
  newExerciseId,
  workoutTaskId,
  currentWorkoutTaskExerciseId,
}: ChageExerciseParams) => {
  const { data } = await apiClient.post(
    `/sessions/${sessionId}/exercises/${oldExerciseId}`,
    {
      workoutId,
      workoutTaskId,
      currentWorkoutTaskExerciseId,
      newExerciseId,
    }
  );
  return data;
};

interface Props {
  sessionId: string;
  oldExerciseId: string;
}

export const useChangeExercise = ({ sessionId, oldExerciseId }: Props) => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    any,
    {
      workoutId: string;
      newExerciseId: string;
      workoutTaskId: string;
      currentWorkoutTaskExerciseId: string;
    }
  >(
    ({
      workoutId,
      newExerciseId,
      workoutTaskId,
      currentWorkoutTaskExerciseId,
    }) =>
      changeExercise({
        workoutId,
        sessionId,
        oldExerciseId,
        newExerciseId,
        workoutTaskId,
        currentWorkoutTaskExerciseId,
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSessionTask');
      },
    }
  );
};
