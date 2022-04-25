import { useQuery } from 'react-query';

const fetchWorkoutSession = async ({ id }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/${id}`,
    {
      credentials: 'include',
    }
  );

  const json = await res.json();

  return json;
};

export const useWorkoutSessionQuery = (id) => {
  return useQuery(['fetchWorkoutSession'], () => fetchWorkoutSession({ id }));
};
