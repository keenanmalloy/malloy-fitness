import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const deleteSet = async (setId: string, sessionId: string) => {
  const { data } = await apiClient.delete(
    `/sessions/${sessionId}/sets/${setId}`
  );
  return data;
};
interface Props {
  sessionId: string;
  setId: string;
}

export const useDeleteSetMutation = ({ setId, sessionId }: Props) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return deleteSet(setId, sessionId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetchSetsByExercise');
      },
    }
  );
};
