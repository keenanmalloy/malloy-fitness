import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const updateSet = async ({ sessionId, body, setId }) => {
  const { data } = await apiClient.put(`/sessions/${sessionId}/sets/${setId}`, {
    body,
  });
  return data;
};

export const useUpdateSetMutation = ({ sessionId, setId }) => {
  const queryClient = useQueryClient();
  return useMutation((body) => updateSet({ sessionId, body, setId }), {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchSetsByExercise');
    },
  });
};
