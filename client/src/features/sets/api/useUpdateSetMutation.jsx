import { useMutation, useQueryClient } from 'react-query';

const updateSet = async ({ sessionId, body, setId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/${sessionId}/sets/${setId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useUpdateSetMutation = ({ sessionId, setId }) => {
  const queryClient = useQueryClient();
  return useMutation((body) => updateSet({ sessionId, body, setId }), {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchSetsByExercise');
    },
  });
};
