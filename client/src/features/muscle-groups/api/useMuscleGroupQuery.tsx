import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetMuscleGroupResponse } from '../types';

const fetchMuscleGroup = async (id: string) => {
  const { data } = await apiClient.get(`/muscle-groups/${id}`);
  return data;
};

export const useMuscleGroupQuery = (id: string) => {
  return useQuery<GetMuscleGroupResponse, any>(
    ['fetchMuscleGroup'],
    () => fetchMuscleGroup(id),
    {
      refetchOnWindowFocus: false,
    }
  );
};
