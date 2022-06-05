import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

const getGoalsSchema = z.object({
  status: z.string(),
  message: z.string(),
  goals: z.object({
    daily_steps_goal: z.nullable(z.number()),
    weekly_cardio_minutes_goal: z.nullable(z.number()),
    body_weight_goal: z.nullable(z.number()),
  }),
});

export type GetGoalsSchema = z.infer<typeof getGoalsSchema>;

const fetchGoals = async () => {
  const { data } = await apiClient.get(`/account/goals`);
  const result = getGoalsSchema.parse(data);
  return result;
};

export const useGoalsQuery = () => {
  return useQuery<GetGoalsSchema>('fetchGoals', fetchGoals);
};
