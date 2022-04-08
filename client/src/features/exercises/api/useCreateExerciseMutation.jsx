import { useMutation } from 'react-query';

const createExercise = async ({ exercise }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json;
};

export const useCreateExerciseMutation = () => {
  return useMutation(createExercise);
};
