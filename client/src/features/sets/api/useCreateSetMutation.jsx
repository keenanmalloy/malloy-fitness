import { useMutation, useQueryClient } from 'react-query';

const createSet = async ({ body, sessionId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/${sessionId}/sets`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useCreateSetMutation = ({ sessionId }) => {
  const queryClient = useQueryClient();
  return useMutation((body) => createSet({ sessionId, body }), {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchSetsByExercise');
    },
  });
};
