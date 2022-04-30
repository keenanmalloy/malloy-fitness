import { apiClient } from 'config/axios';
import { useMutation } from 'react-query';

const addMuscleGroupToExercise = async ({ exerciseId, payload }) => {
  const { data } = await apiClient.post(
    `/exercises/${exerciseId}/muscle-group/`,
    payload
  );

  return data;
};

export const useAddMuscleGroupToExerciseMutation = (exerciseId) => {
  return useMutation((payload) =>
    addMuscleGroupToExercise({ exerciseId, payload })
  );
};
