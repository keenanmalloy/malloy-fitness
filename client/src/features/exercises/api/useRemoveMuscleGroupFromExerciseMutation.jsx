import { useMutation, useQueryClient } from 'react-query';

const removeMuscleGroupFromExercise = async ({
  exerciseId,
  muscleGroupId,
  group,
}) => {
  const res = await fetch(
    `http://localhost:4000/exercises/${exerciseId}/muscle-group/${muscleGroupId}/${group}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useRemoveMuscleGroupFromExerciseMutation = (exerciseId) => {
  const queryClient = useQueryClient();
  return useMutation(({ group, muscleGroupId }) =>
    removeMuscleGroupFromExercise({ exerciseId, muscleGroupId, group })
  );
};
