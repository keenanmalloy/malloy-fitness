import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const scheduleSession = async ({ workoutId, date }) => {
  const { data } = await apiClient.post(`/sessions/`, {
    workout_id: workoutId,
    session_dt: date,
  });
  return data;
};

export const useScheduleSessionMutation = (workoutId) => {
  const queryClient = useQueryClient();
  return useMutation(({ date }) => scheduleSession({ workoutId, date }), {
    onSuccess: () => {
      queryClient.refetchQueries('fetchSessions');
    },
  });
};
