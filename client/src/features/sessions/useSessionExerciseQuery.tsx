import { apiClient } from 'config/axios';
import { useQuery } from 'react-query';

interface FetchSessionExerciseParams {
  exerciseId: string;
  sessionId: string;
}

const fetchSessionExercise = async ({
  exerciseId,
  sessionId,
}: FetchSessionExerciseParams) => {
  const { data } = await apiClient.get(
    `/sessions/${sessionId}/exercises/${exerciseId}`
  );

  return data;
};

export const useSessionExerciseQuery = (
  exerciseId: string,
  sessionId: string
) => {
  return useQuery(['fetchSessionExercise', exerciseId], () =>
    fetchSessionExercise({ exerciseId, sessionId })
  );
};
