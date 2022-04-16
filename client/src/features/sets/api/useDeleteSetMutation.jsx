import { useMutation, useQueryClient } from 'react-query';

const deleteSet = async ({ setId, workoutId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${workoutId}/sets/${setId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useDeleteSetMutation = ({ setId, workoutId }) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return deleteSet({ setId, workoutId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetchSetsByExercise');
      },
    }
  );
};
