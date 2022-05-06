import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const rotateExercise = async ({ workoutId, sessionId, exerciseId }) => {
  const { data } = await apiClient.put(
    `/sessions/${sessionId}/exercises/${exerciseId}`,
    {
      workout_id: workoutId,
    }
  );
  return data;
};

export const useRotateExercise = ({ sessionId, exerciseId }) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ workoutId }) => rotateExercise({ workoutId, sessionId, exerciseId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSessions');
      },
    }
  );
};
