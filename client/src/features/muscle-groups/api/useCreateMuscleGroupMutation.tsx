import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';
import { MutateMuscleGroupArgs } from 'features/muscle-groups/types';

const createMuscleGroup = async (muscleGroup: MutateMuscleGroupArgs) => {
  const { data } = await apiClient.post(`/muscle-groups`, muscleGroup);
  return data;
};

export const useCreateMuscleGroupMutation = () => {
  return useMutation(createMuscleGroup);
};
