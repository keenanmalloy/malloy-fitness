import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const updateField = async (payload) => {
  const { data } = await apiClient.patch(`/auth/me`, payload);
  return data;
};

export const useAccountFieldMutation = () => {
  return useMutation(({ payload }) => updateField(payload));
};
