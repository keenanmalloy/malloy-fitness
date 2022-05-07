import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface CreateSetParams {
  sessionId: string;
  body: any;
}

const createSet = async ({ body, sessionId }: CreateSetParams) => {
  const { data } = await apiClient.post(`/sessions/${sessionId}/sets`, body);
  return data;
};

export const useCreateSetMutation = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>((body) => createSet({ sessionId, body }), {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchSetsByExercise');
    },
  });
};
