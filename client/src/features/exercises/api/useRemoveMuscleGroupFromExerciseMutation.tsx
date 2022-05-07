import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface Params {
  exerciseId: string;
  muscleGroupId: string;
  group: string;
}

const removeMuscleGroupFromExercise = async ({
  exerciseId,
  muscleGroupId,
  group,
}: Params) => {
  const { data } = await apiClient.delete(
    `/exercises/${exerciseId}/muscle-group/${muscleGroupId}/${group}`
  );

  return data;
};

export const useRemoveMuscleGroupFromExerciseMutation = (
  exerciseId: string
) => {
  return useMutation<any, any, Pick<Params, 'group' | 'muscleGroupId'>>(
    ({ group, muscleGroupId }) =>
      removeMuscleGroupFromExercise({ exerciseId, muscleGroupId, group })
  );
};
