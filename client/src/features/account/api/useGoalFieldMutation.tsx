import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const updateField = async (payload: { [key: string]: any }) => {
  const { data } = await apiClient.patch(`/account/goals`, payload);
  return data;
};

export const useGoalFieldMutation = () => {
  return useMutation<any, any, { [key: string]: any }>(({ payload }) =>
    updateField(payload)
  );
};
