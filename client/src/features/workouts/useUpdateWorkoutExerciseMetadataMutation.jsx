import { useMutation } from 'react-query';

const updateWorkoutExerciseMetadata = async ({
  workoutId,
  exerciseId,
  body,
}) => {
  console.log({ body });
  const res = await fetch(
    `http://localhost:4000/workouts/${workoutId}/exercises/${exerciseId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useUpdateWorkoutExerciseMetadataMutation = ({
  workoutId,
  exerciseId,
}) => {
  return useMutation((body) =>
    updateWorkoutExerciseMetadata({ workoutId, exerciseId, body })
  );
};
