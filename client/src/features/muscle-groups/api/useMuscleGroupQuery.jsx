import { useQuery } from 'react-query';

const fetchMuscleGroup = async ({ id }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/muscle-groups/${id}`,
    {
      credentials: 'include',
    }
  );

  const json = await res.json();

  return json;
};

export const useMuscleGroupQuery = (id) => {
  return useQuery(['fetchMuscleGroup'], () => fetchMuscleGroup({ id }), {
    refetchOnWindowFocus: false,
  });
};
