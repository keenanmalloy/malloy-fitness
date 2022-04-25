import { useMutation, useQueryClient } from 'react-query';

const deleteSet = async ({ setId, sessionId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/${sessionId}/sets/${setId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useDeleteSetMutation = ({ setId, sessionId }) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return deleteSet({ setId, sessionId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetchSetsByExercise');
      },
    }
  );
};
