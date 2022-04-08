import { useMutation } from 'react-query';

const deleteExercise = async ({ id }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/exercises/${id}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useDeleteExerciseMutation = (id) => {
  return useMutation(() => {
    return deleteExercise({ id });
  });
};
