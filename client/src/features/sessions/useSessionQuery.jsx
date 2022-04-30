import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchSession = async ({ sessionId }) => {
  const { data } = await apiClient.get(`/sessions/${sessionId}`);
  return data;
};

export const useSessionQuery = (sessionId, exerciseId) => {
  return useQuery(
    ['fetchSession', sessionId, exerciseId],
    () => fetchSession({ sessionId }),
    {
      enabled: !!sessionId,
    }
  );
};
