import { useQuery } from 'react-query';

const fetchDailyOverview = async ({ date, start, end }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/overview?date=${date}&startTime=${start}&endTime=${end}`,
    {
      credentials: 'include',
    }
  );
  const json = await res.json();
  return json;
};

export const useDailyOverviewQuery = (selected) => {
  const start = new Date(
    new Intl.DateTimeFormat('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(
      selected.id
        ? new Date(selected.year, selected.month - 1, selected.day)
        : new Date()
    )
  ).setHours(0, 0, 0, 0);

  const end = new Date(
    new Intl.DateTimeFormat('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(
      selected.id
        ? new Date(selected.year, selected.month - 1, selected.day)
        : new Date()
    )
  ).setHours(23, 59, 59, 999);

  const date = new Date(
    new Intl.DateTimeFormat('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(
      selected.id
        ? new Date(selected.year, selected.month - 1, selected.day)
        : new Date()
    )
  ).toISOString();

  return useQuery(['fetchDailyOverview', date], () =>
    fetchDailyOverview({ date, start, end })
  );
};
