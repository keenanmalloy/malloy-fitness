import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface UpdateSetParams {
  sessionId: string;
  setId: string;
  body: {
    sets: string;
    repetitions: string;
  };
}

const updateSet = async ({ sessionId, body, setId }: UpdateSetParams) => {
  const { data } = await apiClient.put(
    `/sessions/${sessionId}/sets/${setId}`,
    body
  );
  return data;
};

interface Props {
  sessionId: string;
  setId: string;
}

export const useUpdateSetMutation = ({ sessionId, setId }: Props) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>(
    (body) => updateSet({ sessionId, body, setId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetchSetsByExercise');
      },
    }
  );
};
