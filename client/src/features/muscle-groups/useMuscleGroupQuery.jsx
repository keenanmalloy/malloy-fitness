import { useQuery } from 'react-query';

const fetchMuscleGroup = async ({ id }) => {
  const res = await fetch(`http://localhost:4000/muscle-groups/${id}`, {
    credentials: 'include',
  });

  const json = await res.json();

  return json;
};

export const useMuscleGroupQuery = (id) => {
  return useQuery('fetchMuscleGroups', () => fetchMuscleGroup({ id }));
};
