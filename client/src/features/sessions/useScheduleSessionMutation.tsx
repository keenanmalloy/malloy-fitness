import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface ScheduleSessionParams {
  workoutId: string;
  date: Date;
}

const scheduleSession = async ({ workoutId, date }: ScheduleSessionParams) => {
  const { data } = await apiClient.post(`/sessions/`, {
    workout_id: workoutId,
    session_dt: date,
  });
  return data;
};

export const useScheduleSessionMutation = (workoutId: string) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { date: Date }>(
    ({ date }) => scheduleSession({ workoutId, date }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSessions');
      },
    }
  );
};
