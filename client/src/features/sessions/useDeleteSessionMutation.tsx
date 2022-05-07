import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const deleteSession = async (sessionId: string) => {
  const { data } = await apiClient.delete(`/sessions/${sessionId}`);
  return data;
};

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { sessionId: string }>(
    ({ sessionId }) => deleteSession(sessionId),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchDailyOverview');
      },
    }
  );
};
