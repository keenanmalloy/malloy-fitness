import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { GetSetsResponse } from '../types';

const fetchSetsByExercise = async (exerciseId: string, sessionId: string) => {
  const { data } = await apiClient.get(
    `/sessions/${sessionId}/exercise/${exerciseId}/sets/`
  );

  return data;
};

interface Props {
  exerciseId: string;
  sessionId: string;
}
export const useSetsByExerciseQuery = ({ sessionId, exerciseId }: Props) => {
  return useQuery<GetSetsResponse>(['fetchSetsByExercise', exerciseId], () =>
    fetchSetsByExercise(exerciseId, sessionId)
  );
};
