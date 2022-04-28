import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchExercises = async ({
  muscleGroupIds,
  type,
  profile,
  category,
  exerciseId,
}) => {
  const { data } = await apiClient.get(
    `/exercises/?mgIds=${muscleGroupIds.join(
      ','
    )}&type=${type}&profile=${profile}&category=${category}&exerciseId=${exerciseId}`
  );
  return data;
};

export const useRelatedExercisesQuery = ({
  muscleGroupIds,
  type,
  profile,
  category,
  exerciseId,
}) => {
  return useQuery(
    ['fetchExerciseByIds', exerciseId],
    () =>
      fetchExercises({ muscleGroupIds, type, profile, category, exerciseId }),
    {
      refetchOnWindowFocus: false,
      enabled: muscleGroupIds.length > 0,
    }
  );
};
