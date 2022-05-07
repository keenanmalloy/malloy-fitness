import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface ChageExerciseParams {
  workoutId: string;
  sessionId: string;
  oldExerciseId: string;
  newExerciseId: string;
}

const changeExercise = async ({
  workoutId,
  sessionId,
  oldExerciseId,
  newExerciseId,
}: ChageExerciseParams) => {
  const { data } = await apiClient.post(
    `/sessions/${sessionId}/exercises/${oldExerciseId}`,
    {
      workout_id: workoutId,
      new_exercise_id: newExerciseId,
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
    }
  >(
    ({ workoutId, newExerciseId }) =>
      changeExercise({ workoutId, sessionId, oldExerciseId, newExerciseId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSessions');
      },
    }
  );
};
