import { useMutation } from 'react-query';

const createMuscleGroup = async ({ muscleGroup }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/muscle-groups`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(muscleGroup),
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useCreateMuscleGroupMutation = () => {
  return useMutation(createMuscleGroup);
};