import { useMutation } from 'react-query';

const scheduleNewWorkout = async ({ id, date }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}/copy?date=${date}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useScheduleNewWorkoutMutation = (id) => {
  return useMutation(({ date }) => scheduleNewWorkout({ id, date }));
};
