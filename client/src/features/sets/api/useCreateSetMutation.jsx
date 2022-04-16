import { useMutation, useQueryClient } from 'react-query';

const createSet = async ({ body, workoutId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${workoutId}/sets`,
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

export const useCreateSetMutation = ({ workoutId }) => {
  const queryClient = useQueryClient();
  return useMutation((body) => createSet({ workoutId, body }), {
    onSuccess: () => {
      queryClient.invalidateQueries('fetchSetsByExercise');
    },
  });
};
