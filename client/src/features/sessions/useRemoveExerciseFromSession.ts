import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface RemoveSessionParams {
  workoutId: string;
  workoutTaskId: string;
  sessionId: string;
}

const removeSession = async ({
  workoutId,
  workoutTaskId,
  sessionId,
}: RemoveSessionParams) => {
  const { data } = await apiClient.delete(
    `/sessions/${sessionId}/tasks/${workoutTaskId}?workoutId=${workoutId}`
  );
  return data;
};

export const useRemoveExerciseFromSession = (
  sessionId: string,
  workoutId: string
) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { workoutTaskId: string }>(
    ({ workoutTaskId }) =>
      removeSession({ workoutId, sessionId, workoutTaskId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSession');
      },
    }
  );
};
