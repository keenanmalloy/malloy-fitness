import { useMutation } from 'react-query';

const deleteExercise = async ({ id }) => {
  const res = await fetch(`http://localhost:4000/exercises/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const json = await res.json();
  return json;
};

export const useDeleteExerciseMutation = (id) => {
  return useMutation(() => {
    return deleteExercise({ id });
  });
};
