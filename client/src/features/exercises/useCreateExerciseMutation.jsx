import { useMutation } from 'react-query';

const createExercise = async ({ exercise }) => {
  const res = await fetch('http://localhost:4000/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise),
    credentials: 'include',
  });
  const json = await res.json();
  return json;
};

export const useCreateExerciseMutation = () => {
  return useMutation(createExercise);
};
