import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

const workoutSessionSchema = z.object({
  status: z.string(),
  message: z.string(),
  session: z.object({
    session_id: z.string(),
    workout_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    started_at: z.nullable(z.string()),
    ended_at: z.nullable(z.string()),
    session_dt: z.string(),
    completed: z.boolean(),
    deload: z.boolean(),
    readiness_energy: z.nullable(z.string()),
    readiness_mood: z.nullable(z.string()),
    readiness_stress: z.nullable(z.string()),
    readiness_soreness: z.nullable(z.string()),
    readiness_sleep: z.nullable(z.string()),
    created_by: z.string(),
    name: z.string(),
    description: z.nullable(z.string()),
    category: z.nullable(z.string()),
    type: z.nullable(z.string()),
    task_order: z.nullable(z.array(z.string())),
    view: z.string(),
    tasks: z.array(
      z.object({
        workout_task_id: z.string(),
        exercises: z.array(
          z.object({
            exercise_id: z.string(),
            name: z.string(),
            repetitions: z.nullable(z.string()),
            reps_in_reserve: z.nullable(z.string()),
            rest_period: z.nullable(z.string()),
            sets: z.nullable(z.string()),
            workout_task_id: z.string(),
            workout_task_exercise_id: z.string(),
          })
        ),
      })
    ),
  }),
});

export type WorkoutSessionSchema = z.infer<typeof workoutSessionSchema>;

const fetchWorkoutSession = async (id: string) => {
  const { data } = await apiClient.get(`/sessions/${id}`);
  return data;
};

export const useWorkoutSessionQuery = (id: string) => {
  return useQuery<WorkoutSessionSchema>(['fetchWorkoutSession'], () =>
    fetchWorkoutSession(id)
  );
};
