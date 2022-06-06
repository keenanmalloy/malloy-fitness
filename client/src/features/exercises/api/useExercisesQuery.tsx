import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

const getExercisesSchema = z.object({
  status: z.string(),
  message: z.string(),
  role: z.string(),
  exercises: z.array(
    z.object({
      name: z.string(),
      video: z.nullable(z.string()),
      exercise_id: z.string(),
      primary_tracker: z.nullable(z.string()),
      secondary_tracker: z.nullable(z.string()),
      profile: z.string(),
      category: z.string(),
      created_by: z.string(),
      description: z.nullable(z.string()),
      view: z.string(),
      type: z.string(),
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
    })
  ),
});

export type GetExercisesSchema = z.infer<typeof getExercisesSchema>;

interface FetchExercisesQueryParams {
  query?: string;
  category?: string;
  view?: string;
  profile?: string;
  sortBy?: string;
}

const fetchExercises = async ({
  query,
  category,
  view,
  profile,
  sortBy,
}: FetchExercisesQueryParams) => {
  const { data } = await apiClient.get(
    `/exercises/?q=${query ?? ''}&category=${category ?? ''}&view=${
      view ?? ''
    }&profile=${profile ?? ''}&sortBy=${sortBy ?? ''}`
  );

  return data;
};

export const useExercisesQuery = ({
  query,
  category,
  view,
  profile,
  sortBy,
}: FetchExercisesQueryParams) => {
  return useQuery<GetExercisesSchema>(
    ['fetchExercises', query, category, view, profile, sortBy],
    () => fetchExercises({ query, category, view, profile, sortBy })
  );
};
