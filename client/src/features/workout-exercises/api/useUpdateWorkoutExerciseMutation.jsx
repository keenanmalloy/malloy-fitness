import { useMutation } from 'react-query';

const updateWorkoutExercise = async ({ workoutId, exerciseId, payload }) => {
  console.log({ payload });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${workoutId}/exercises/${exerciseId}/`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useUpdateWorkoutExerciseMutation = (workoutId, exerciseId) => {
  return useMutation((data) => {
    return updateWorkoutExercise({ workoutId, exerciseId, payload: data });
  });
};