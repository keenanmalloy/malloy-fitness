import { apiClient } from 'config/axios';
import { useMutation } from 'react-query';
import { MuscleGroup } from '../types';

interface Params {
  payload: MuscleGroup;
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
  return useMutation<any, any, MuscleGroup>((payload) =>
    addMuscleGroupToExercise({ exerciseId, payload })
  );
};
