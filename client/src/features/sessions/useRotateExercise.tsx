import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface RotateExerciseParams {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
}

const rotateExercise = async ({
  workoutId,
  sessionId,
  exerciseId,
}: RotateExerciseParams) => {
  const { data } = await apiClient.put(
    `/sessions/${sessionId}/exercises/${exerciseId}`,
    {
      workout_id: workoutId,
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
  return useMutation<any, any, { workoutId: string }>(
    ({ workoutId }) => rotateExercise({ workoutId, sessionId, exerciseId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSessions');
      },
    }
  );
};
