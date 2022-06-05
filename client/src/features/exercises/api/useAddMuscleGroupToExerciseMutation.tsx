import { apiClient } from 'config/axios';
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
