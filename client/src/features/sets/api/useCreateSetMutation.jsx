import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const createSet = async ({ body, sessionId }) => {
  const { data } = await apiClient.post(`/sessions/${sessionId}/sets`, body);
  return data;
};

export const useCreateSetMutation = ({ sessionId }) => {
  const queryClient = useQueryClient();
  return useMutation((body) => createSet({ sessionId, body }), {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchSetsByExercise');
    },
  });
};
