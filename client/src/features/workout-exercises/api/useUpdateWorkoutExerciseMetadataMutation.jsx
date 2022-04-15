import { useMutation } from 'react-query';

const updateWorkoutExerciseMetadata = async ({
  workoutId,
  exerciseId,
  body,
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${workoutId}/exercises/${exerciseId}`,
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
