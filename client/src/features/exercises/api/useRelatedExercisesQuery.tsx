import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetRelatedExercisesResponse } from '../types';

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
  return data;
};

export const useRelatedExercisesQuery = ({
  muscleGroupIds,
  type,
  profile,
  category,
  exerciseId,
}: FetchRelatedExercisesQueryParams) => {
  return useQuery<GetRelatedExercisesResponse>(
    ['fetchExerciseByIds', exerciseId],
    () =>
      fetchExercises({ muscleGroupIds, type, profile, category, exerciseId }),
    {
      refetchOnWindowFocus: false,
      enabled: muscleGroupIds.length > 0,
    }
  );
};
