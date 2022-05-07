import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

const createExercise = async ({
  exercise,
}: {
  exercise: {
    name: string;
    description: string;
    primaryTracker: string;
    secondaryTracker: string;
    type: string;
  };
}) => {
  const { data } = await apiClient.post(`/exercises`, exercise);
  return data;
};

export const useCreateExerciseMutation = () => {
  return useMutation(createExercise);
};
