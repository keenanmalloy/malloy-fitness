import { useMutation, useQueryClient } from 'react-query';

const scheduleSession = async ({ workoutId, date }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ workout_id: workoutId, session_dt: date }),
  });
  const json = await res.json();
  return json;
};

export const useScheduleSessionMutation = (workoutId) => {
  const queryClient = useQueryClient();
  return useMutation(({ date }) => scheduleSession({ workoutId, date }), {
    onSuccess: () => {
      queryClient.refetchQueries('fetchSessions');
    },
  });
};
