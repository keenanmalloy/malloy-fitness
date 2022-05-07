import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetAccountResponse } from 'features/account/types';

const fetchAccount = async () => {
  const { data } = await apiClient.get(`/auth/me`);
  return data;
};

export const useAccountQuery = () => {
  return useQuery<GetAccountResponse>('fetchAccount', fetchAccount);
};
