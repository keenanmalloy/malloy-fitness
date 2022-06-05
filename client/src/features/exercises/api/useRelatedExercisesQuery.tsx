import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

// {
//   "message": "Exercises fetched successfully",
//   "status": "success",
//   "exercises": [
//       {
//           "name": "Single Arm Dumbell Preacher Curl",
//           "exercise_id": "128"
//       },
//       {
//           "name": "Cable Hammer Curl",
//           "exercise_id": "131"
//       }
//   ]
// }

const getRelatedExercisesSchema = z.object({
  status: z.string(),
  message: z.string(),
  exercises: z.array(
    z.object({
      name: z.string(),
      exercise_id: z.string(),
    })
  ),
});

export type GetRelatedExercisesSchema = z.infer<
  typeof getRelatedExercisesSchema
>;

interface FetchRelatedExercisesQueryParams {
  muscleGroupIds: string[];
  type: string;
  profile: string;
  category: string;
  exerciseId: string;
}

const fetchExercises = async ({
  muscleGroupIds,
  type,
  profile,
  category,
  exerciseId,
}: FetchRelatedExercisesQueryParams) => {
  const { data } = await apiClient.get(
    `/exercises/?mgIds=${muscleGroupIds.join(
      ','
    )}&type=${type}&profile=${profile}&category=${category}&exerciseId=${exerciseId}`
  );
  const result = getRelatedExercisesSchema.parse(data);
  return result;
};

export const useRelatedExercisesQuery = ({
  muscleGroupIds,
  type,
  profile,
  category,
  exerciseId,
}: FetchRelatedExercisesQueryParams) => {
  return useQuery<GetRelatedExercisesSchema>(
    ['fetchExerciseByIds', exerciseId],
    () =>
      fetchExercises({ muscleGroupIds, type, profile, category, exerciseId }),
    {
      refetchOnWindowFocus: false,
      enabled: muscleGroupIds.length > 0,
    }
  );
};
