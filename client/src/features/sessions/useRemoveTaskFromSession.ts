import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface RemoveSessionTaskParams {
  workoutId: string;
  workoutTaskId: string;
  sessionId: string;
}

const removeTask = async ({
  workoutId,
  workoutTaskId,
  sessionId,
}: RemoveSessionTaskParams) => {
  const { data } = await apiClient.delete(
    `/sessions/${sessionId}/tasks/${workoutTaskId}?workoutId=${workoutId}`
  );
  return data;
};

export const useRemoveTaskFromSession = (
  sessionId: string,
  workoutId: string
) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { workoutTaskId: string }>(
    ({ workoutTaskId }) => removeTask({ workoutId, sessionId, workoutTaskId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSession');
      },
    }
  );
};
