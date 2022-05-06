import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';

const fetchSetsByExercise = async (exerciseId, sessionId) => {
  const { data } = await apiClient.get(
    `/sessions/${sessionId}/exercise/${exerciseId}/sets/`
  );

  return data;
};

export const useSetsByExerciseQuery = ({ sessionId, exerciseId }) => {
  return useQuery(['fetchSetsByExercise', exerciseId], () =>
    fetchSetsByExercise(exerciseId, sessionId)
  );
};
