import { useQuery } from 'react-query';

const fetchMuscleGroups = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/muscle-groups/`,
    {
      credentials: 'include',
    }
  );

  const json = await res.json();

  return json;
};

export const useMuscleGroupsQuery = () => {
  return useQuery(['fetchMuscleGroups'], fetchMuscleGroups);
};
