import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetGoalsResponse } from 'features/account/types';

const fetchGoals = async () => {
  const { data } = await apiClient.get(`/account/goals`);
  return data;
};

export const useGoalsQuery = () => {
  return useQuery<GetGoalsResponse>('fetchGoals', fetchGoals);
};
