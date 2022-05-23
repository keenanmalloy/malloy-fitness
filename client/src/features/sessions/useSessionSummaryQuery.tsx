import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

const sessionSchema = z.object({
  status: z.string(),
  message: z.string(),
  session: z.object({
    name: z.nullable(z.string()),
    category: z.nullable(z.string()),
    type: z.string(),
    session_id: z.string(),
    workout_id: z.string(),
    started_at: z.nullable(z.string()),
    readiness_energy: z.nullable(z.number()),
    readiness_mood: z.nullable(z.number()),
    readiness_stress: z.nullable(z.number()),
    readiness_soreness: z.nullable(z.number()),
    readiness_sleep: z.nullable(z.number()),
    ended_at: z.nullable(z.string()),
    completed: z.boolean(),
    task_order: z.nullable(z.array(z.string())),
    tasks: z.nullable(
      z.array(
        z.object({
          workout_task_id: z.string(),
          exercises: z.array(
            z.object({
              exercise_id: z.string(),
              name: z.string(),
              video: z.nullable(z.string()),
              primary_tracker: z.nullable(z.string()),
              secondary_tracker: z.nullable(z.string()),
              workout_task_id: z.string(),
              workout_task_exercise_id: z.string(),
              sets: z.array(
                z.object({
                  set_id: z.string(),
                  repetitions: z.number().optional(),
                  weight: z.number().optional(),
                  completed: z.boolean().optional(),
                })
              ),
            })
          ),
        })
      )
    ),
  }),
});

export type SessionSchema = z.infer<typeof sessionSchema>;

const fetchSession = async (sessionId: string) => {
  const { data } = await apiClient.get(`/sessions/${sessionId}/summary`);
  const result = sessionSchema.parse(data);
  return result;
};

export const useSessionSummaryQuery = (sessionId: string) => {
  return useQuery<SessionSchema>(
    ['fetchSession', sessionId],
    () => fetchSession(sessionId),
    {
      enabled: !!sessionId,
    }
  );
};
