import { useMutation } from 'react-query';

const updateExercise = async ({ id, exercise }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/exercises/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise),
      credentials: 'include',
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json;
};

export const useUpdateExerciseMutation = (id) => {
  return useMutation(({ exercise }) => updateExercise({ id, exercise }));
};
