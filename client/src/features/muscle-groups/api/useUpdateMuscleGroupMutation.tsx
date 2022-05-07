import { __ } from '@headlessui/react/dist/types';
import { apiClient } from 'config/axios';
import { useMutation } from 'react-query';
import { MutateMuscleGroupArgs } from '../types';

const updateMuscleGroup = async (
  id: string,
  muscleGroup: MutateMuscleGroupArgs
) => {
  const { data } = await apiClient.put(`/muscle-groups/${id}`, muscleGroup);
  return data;
};

export const useUpdateMuscleGroupMutation = (id: string) => {
  return useMutation<any, any, { muscleGroup: MutateMuscleGroupArgs }>(
    ({ muscleGroup }) => updateMuscleGroup(id, muscleGroup)
  );
};
