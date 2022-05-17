import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const updateField = async (sessionId: string) => {
  const { data } = await apiClient.patch(`/sessions/${sessionId}/end`);
  return data;
};

export const useEndSessionMutation = (sessionId: string) => {
  return useMutation<any, any, { [key: string]: any }>(() => {
    return updateField(sessionId);
  });
};
