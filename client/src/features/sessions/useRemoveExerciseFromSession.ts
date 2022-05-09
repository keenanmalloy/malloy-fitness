import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface RemoveSessionParams {
  workoutId: string;
  exerciseId: string;
  sessionId: string;
}

const removeSession = async ({
  workoutId,
  exerciseId,
  sessionId,
}: RemoveSessionParams) => {
  const { data } = await apiClient.delete(
    `/sessions/${sessionId}/exercises/${exerciseId}?workoutId=${workoutId}`
  );
  return data;
};

export const useRemoveExerciseFromSession = (
  sessionId: string,
  workoutId: string
) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { exerciseId: string }>(
    ({ exerciseId }) => removeSession({ workoutId, sessionId, exerciseId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSession');
      },
    }
  );
};
