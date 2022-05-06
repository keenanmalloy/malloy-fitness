import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetMuscleGroupsResponse } from '../types';

const fetchMuscleGroups = async () => {
  const { data } = await apiClient.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/muscle-groups/`
  );

  return data;
};

export const useMuscleGroupsQuery = () => {
  return useQuery<GetMuscleGroupsResponse, any>(
    ['fetchMuscleGroups'],
    fetchMuscleGroups
  );
};
