import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchSession = async ({ sessionId }) => {
  const { data } = await apiClient.get(`/sessions/${sessionId}/summary`);
  return data;
};

export const useSessionSummaryQuery = (sessionId) => {
  return useQuery(
    ['fetchSession', sessionId],
    () => fetchSession({ sessionId }),
    {
      enabled: !!sessionId,
    }
  );
};
