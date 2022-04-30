import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const deleteSet = async ({ setId, sessionId }) => {
  const { data } = await apiClient.delete(
    `/sessions/${sessionId}/sets/${setId}`
  );
  return data;
};

export const useDeleteSetMutation = ({ setId, sessionId }) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return deleteSet({ setId, sessionId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetchSetsByExercise');
      },
    }
  );
};
