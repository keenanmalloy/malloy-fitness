import { useQuery } from 'react-query';

const fetchMuscleGroups = async () => {
  const res = await fetch('http://localhost:4000/muscle-groups/', {
    credentials: 'include',
  });

  const json = await res.json();

  return json;
};

export const useMuscleGroupsQuery = () => {
  return useQuery('fetchMuscleGroups', fetchMuscleGroups);
};
