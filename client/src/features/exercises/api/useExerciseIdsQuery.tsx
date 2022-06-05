import { apiClient } from 'config/axios';
import { useQuery } from 'react-query';
import { z } from 'zod';

const getExercisesByIdsSchema = z.object({
  status: z.string(),
  message: z.string(),
  exercises: z.array(
    z.object({
      exercise_id: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      view: z.string(),
      name: z.string(),
      description: z.nullable(z.string()),
      category: z.string(),
      video: z.nullable(z.string()),
      profile: z.string(),
      primary_tracker: z.nullable(z.string()),
      secondary_tracker: z.nullable(z.string()),
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
    })
  ),
});

export type GetExercisesByIdsSchema = z.infer<typeof getExercisesByIdsSchema>;

const fetchExercises = async (ids: string[]) => {
  // fetch the data, the fetch call returns a promise of a response.
  // we await for the promise to resolve with the await keyword.
  const { data } = await apiClient.get(`/exercises/?ids=${ids.join(',')}`);

  // return the data that we got from the API.
  return data;
};

export const useExerciseIdsQuery = (ids: string[]) => {
  return useQuery<GetExercisesByIdsSchema>(
    ['fetchExerciseByIds', ids],
    () => fetchExercises(ids),
    {
      enabled: !!ids.length,
    }
  );
};
