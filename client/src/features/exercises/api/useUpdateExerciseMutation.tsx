import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

interface Params {
  id: string;
  exercise: any;
}

const updateExercise = async ({ id, exercise }: Params) => {
  const { data } = await apiClient.put(`/exercises/${id}`, exercise);
  return data;
};

export const useUpdateExerciseMutation = (id: string) => {
  return useMutation<any, any, any>(({ exercise }) =>
    updateExercise({ id, exercise })
  );
};
