import { useMutation } from 'react-query';

const updateMuscleGroup = async ({ id, muscleGroup }) => {
  const res = await fetch(`http://localhost:4000/muscle-groups/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(muscleGroup),
    credentials: 'include',
  });
  const json = await res.json();
  return json;
};

export const useUpdateMuscleGroupMutation = (id) => {
  return useMutation(({ muscleGroup }) =>
    updateMuscleGroup({ id, muscleGroup })
  );
};
