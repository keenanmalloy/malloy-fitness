import { useMutation } from 'react-query';

const updateExercise = async ({ id, exercise }) => {
  const res = await fetch(`http://localhost:4000/exercises/${id}`, {
    method: 'PUT',
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

export const useUpdateExerciseMutation = (id) => {
  return useMutation(({ exercise }) => updateExercise({ id, exercise }));
};
