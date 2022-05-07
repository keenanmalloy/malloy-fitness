import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetSessionResponse } from './types';

const fetchSession = async (sessionId: string) => {
  const { data } = await apiClient.get(`/sessions/${sessionId}`);
  return data;
};

export const useSessionQuery = (sessionId: string, exerciseId: string) => {
  return useQuery<GetSessionResponse>(
    ['fetchSession', sessionId, exerciseId],
    () => fetchSession(sessionId),
    {
      enabled: !!sessionId,
    }
  );
};
