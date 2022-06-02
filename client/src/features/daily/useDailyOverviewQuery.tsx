import { apiClient } from 'config/axios';
import { useQuery } from 'react-query';
import { z } from 'zod';

export type SelectedDate = {
  day: number;
  month: number;
  year: number;
  id: string;
};

const getDailyOverviewSchema = z.object({
  status: z.string(),
  message: z.string(),
  sessions: z.array(
    z.object({
      workout_id: z.string(),
      created_by: z.string(),
      name: z.string(),
      description: z.nullable(z.string()),
      category: z.nullable(z.string()),
      type: z.string(),
      view: z.string(),
      session_id: z.string(),
      started_at: z.nullable(z.string()),
      ended_at: z.nullable(z.string()),
      session_dt: z.string(),
      completed: z.boolean(),
      video: z.nullable(z.string()),
      deload: z.boolean(),
    })
  ),
  steps: z.nullable(z.number()),
  goals: z.object({
    setting_id: z.string(),
    updated_at: z.string(),
    account_id: z.string(),
    unit_preference: z.string(),
    appearance: z.string(),
    daily_steps_goal: z.nullable(z.number()),
    weekly_cardio_minutes_goal: z.nullable(z.number()),
    body_weight_goal: z.nullable(z.number()),
  }),
});

export type GetDailyOverviewSchema = z.infer<typeof getDailyOverviewSchema>;

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

  const result = getDailyOverviewSchema.parse(data);
  return result;
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

  return useQuery<GetDailyOverviewSchema>(['fetchDailyOverview', date], () =>
    fetchDailyOverview({ date, start, end })
  );
};
