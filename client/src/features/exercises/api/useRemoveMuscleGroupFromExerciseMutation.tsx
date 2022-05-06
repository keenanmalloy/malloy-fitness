import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const removeMuscleGroupFromExercise = async ({
  exerciseId,
  muscleGroupId,
  group,
}) => {
  const { data } = await apiClient.delete(
    `/exercises/${exerciseId}/muscle-group/${muscleGroupId}/${group}`
  );

  return data;
};

export const useRemoveMuscleGroupFromExerciseMutation = (exerciseId) => {
  const queryClient = useQueryClient();
  return useMutation(({ group, muscleGroupId }) =>
    removeMuscleGroupFromExercise({ exerciseId, muscleGroupId, group })
  );
};
