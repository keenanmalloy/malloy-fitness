import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const updateField = async (payload: { [key: string]: any }) => {
  const { data } = await apiClient.patch(`/auth/me`, payload);
  return data;
};

export const useAccountFieldMutation = () => {
  return useMutation<any, any, { [key: string]: any }>(({ payload }) =>
    updateField(payload)
  );
};
