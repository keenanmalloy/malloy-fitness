import { useMutation, useQueryClient } from 'react-query';

const addMuscleGroupToExercise = async ({ exerciseId, payload }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/exercises/${exerciseId}/muscle-group/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useAddMuscleGroupToExerciseMutation = (exerciseId) => {
  const queryClient = useQueryClient();
  return useMutation((payload) =>
    addMuscleGroupToExercise({ exerciseId, payload })
  );
};
