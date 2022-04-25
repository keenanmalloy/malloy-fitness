import { useQuery } from 'react-query';

const fetchGoogleFitSteps = async ({ startTimeMillis, endTimeMillis }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/providers/google/fit/steps?startTime=${startTimeMillis}&endTime=${endTimeMillis}`,
      {
        credentials: 'include',
      }
    );

    const json = await res.json();

    return json;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const useStepsQuery = ({ startTimeMillis, endTimeMillis }) => {
  return useQuery(
    ['fetchGoogleFitSteps', startTimeMillis],
    () => fetchGoogleFitSteps({ startTimeMillis, endTimeMillis }),
    { refetchOnWindowFocus: false, refetchOnReconnect: true }
  );
};
