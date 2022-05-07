import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { SessionSummaryResponse } from './types';

const fetchSession = async (sessionId: string) => {
  const { data } = await apiClient.get(`/sessions/${sessionId}/summary`);
  return data;
};

export const useSessionSummaryQuery = (sessionId: string) => {
  return useQuery<SessionSummaryResponse>(
    ['fetchSession', sessionId],
    () => fetchSession(sessionId),
    {
      enabled: !!sessionId,
    }
  );
};