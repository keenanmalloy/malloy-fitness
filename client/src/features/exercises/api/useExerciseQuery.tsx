import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

const getExerciseSchema = z.object({
  status: z.string(),
  message: z.string(),
  role: z.string(),
  exercise: z.object({
    exercise_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    view: z.string(),
    name: z.string(),
    description: z.nullable(z.string()),
    category: z.string(),
    video: z.string(),
    profile: z.string(),
    primary_tracker: z.string(),
    secondary_tracker: z.string(),
    type: z.string(),
    created_by: z.string(),
    primary: z.array(
      z.object({
        name: z.string(),
        description: z.nullable(z.string()),
        muscle_group_id: z.string(),
        group: z.string(),
      })
    ),
    secondary: z.array(
      z.object({
        name: z.string(),
        description: z.nullable(z.string()),
        muscle_group_id: z.string(),
        group: z.string(),
      })
    ),
  }),
});

export type GetExerciseSchema = z.infer<typeof getExerciseSchema>;

const fetchExercise = async (id: string) => {
  const { data } = await apiClient.get(`/exercises/${id}`);
  const result = getExerciseSchema.parse(data);
  return result;
};

export const useExerciseQuery = (id: string) => {
  return useQuery<GetExerciseSchema>(['fetchExercise', id], () =>
    fetchExercise(id)
  );
};
