import { useQuery } from 'react-query';

const fetchDailyOverview = async ({ date }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/overview?date=${date}`,
    {
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useDailyOverviewQuery = (date) => {
  return useQuery(['fetchDailyOverview', date], () =>
    fetchDailyOverview({ date })
  );
};
