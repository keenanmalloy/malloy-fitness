import { apiClient } from 'config/axios';
import { useQuery } from 'react-query';
import { GetDailyResponse, SelectedDate } from './types';

const fetchDailyOverview = async ({
  date,
  start,
  end,
}: {
  date: string;
  start: number;
  end: number;
}) => {
  const { data } = await apiClient.get(
    `/overview?date=${date}&startTime=${start}&endTime=${end}`
  );

  return data;
};

export const useDailyOverviewQuery = (selected: SelectedDate) => {
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

  return useQuery<GetDailyResponse, any>(['fetchDailyOverview', date], () =>
    fetchDailyOverview({ date, start, end })
  );
};
