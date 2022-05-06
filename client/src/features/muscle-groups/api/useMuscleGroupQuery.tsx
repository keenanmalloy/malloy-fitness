import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchMuscleGroup = async ({ id }) => {
  const { data } = await apiClient.get(`/muscle-groups/${id}`);
  return data;
};

export const useMuscleGroupQuery = (id) => {
  return useQuery(['fetchMuscleGroup'], () => fetchMuscleGroup({ id }), {
    refetchOnWindowFocus: false,
  });
};
