import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchSession = async (sessionId: string) => {
  const { data } = await apiClient.get(`/sessions/${sessionId}`);
  return data;
};

export const useSessionQuery = (sessionId: string, exerciseId: string) => {
  return useQuery(
    ['fetchSession', sessionId, exerciseId],
    () => fetchSession(sessionId),
    {
      enabled: !!sessionId,
    }
  );
};
