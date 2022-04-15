import { useMutation } from 'react-query';

const updateSet = async ({ workoutId, body, setId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${workoutId}/sets/${setId}`,
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

export const useUpdateSetMutation = ({ workoutId, setId }) => {
  return useMutation((body) => updateSet({ workoutId, body, setId }));
};
