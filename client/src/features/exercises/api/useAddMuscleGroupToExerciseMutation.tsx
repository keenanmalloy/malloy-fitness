import { apiClient } from 'config/axios';
import { MuscleGroup } from 'features/muscle-groups/types';
import { useMutation } from 'react-query';

interface Params {
  payload: {
    group: 'primary' | 'secondary';
    muscleGroupId: string;
  };
  exerciseId: string;
}

const addMuscleGroupToExercise = async ({ exerciseId, payload }: Params) => {
  const { data } = await apiClient.post(
    `/exercises/${exerciseId}/muscle-group/`,
    payload
  );

  return data;
};

export const useAddMuscleGroupToExerciseMutation = (exerciseId: string) => {
  return useMutation<any, any, Params['payload']>((payload) =>
    addMuscleGroupToExercise({ exerciseId, payload })
  );
};
