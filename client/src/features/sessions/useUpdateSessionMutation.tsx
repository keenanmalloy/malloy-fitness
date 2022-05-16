import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from 'config/axios';

const updateField = async (
  payload: { [key: string]: any },
  sessionId: string
) => {
  const { data } = await apiClient.patch(`/sessions/${sessionId}`, payload);
  return data;
};

export const useUpdateSessionMutation = (sessionId: string) => {
  return useMutation<any, any, { [key: string]: any }>(({ payload }) => {
    return updateField(payload, sessionId);
  });
};
