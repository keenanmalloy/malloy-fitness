import { apiClient } from 'config/axios';
import { useMutation } from 'react-query';

const updateMuscleGroup = async ({ id, muscleGroup }) => {
  const { data } = await apiClient.put(`/muscle-groups/${id}`, muscleGroup);
  return data;
};

export const useUpdateMuscleGroupMutation = (id) => {
  return useMutation(({ muscleGroup }) =>
    updateMuscleGroup({ id, muscleGroup })
  );
};
