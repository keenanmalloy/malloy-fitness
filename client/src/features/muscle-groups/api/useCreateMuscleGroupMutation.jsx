import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const createMuscleGroup = async ({ muscleGroup }) => {
  const { data } = await apiClient.post(`/muscle-groups`, muscleGroup);
  return data;
};

export const useCreateMuscleGroupMutation = () => {
  return useMutation(createMuscleGroup);
};
