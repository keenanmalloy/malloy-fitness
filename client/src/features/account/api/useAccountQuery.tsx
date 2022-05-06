import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchAccount = async () => {
  const { data } = await apiClient.get(`/auth/me`);
  return data;
};

export const useAccountQuery = () => {
  return useQuery('fetchAccount', fetchAccount);
};
