import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const deleteMuscleGroup = async ({ id }) => {
  const { data } = await apiClient.delete(`/muscle-groups/${id}`);
  return data;
};

export const useDeleteMuscleGroupMutation = () => {
  return useMutation(deleteMuscleGroup);
};
