import { apiClient } from 'config/axios';
import { useQuery } from 'react-query';

const fetchSessionExercise = async ({ exerciseId, sessionId }) => {
  const { data } = await apiClient.get(
    `/sessions/${sessionId}/exercises/${exerciseId}`
  );

  return data;
};

export const useSessionExerciseQuery = (exerciseId, sessionId) => {
  return useQuery(['fetchSessionExercise', exerciseId], () =>
    fetchSessionExercise({ exerciseId, sessionId })
  );
};
