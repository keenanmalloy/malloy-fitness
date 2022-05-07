import { apiClient } from 'config/axios';
import { useMutation } from 'react-query';
import { GetDailyResponse } from 'features/daily/types';

const initializeSession = async (date: string) => {
  const { data } = await apiClient.post<GetDailyResponse>(`/sessions/init`, {
    session_dt: date,
  });
  return data;
};

export const useInitSessionMutation = () => {
  return useMutation<any, any, { date: string }>(({ date }) =>
    initializeSession(date)
  );
};
