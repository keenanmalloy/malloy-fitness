import { useMutation } from 'react-query';

const deleteMuscleGroup = async ({ id }) => {
  const res = await fetch(`http://localhost:4000/muscle-groups/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const json = await res.json();
  return json;
};

export const useDeleteMuscleGroupMutation = () => {
  return useMutation(deleteMuscleGroup);
};
