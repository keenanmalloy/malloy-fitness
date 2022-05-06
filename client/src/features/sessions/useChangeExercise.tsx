import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

const changeExercise = async ({
  workoutId,
  sessionId,
  oldExerciseId,
  newExerciseId,
}) => {
  const { data } = await apiClient.post(
    `/sessions/${sessionId}/exercises/${oldExerciseId}`,
    {
      workout_id: workoutId,
      new_exercise_id: newExerciseId,
    }
  );
  return data;
};

export const useChangeExercise = ({ sessionId, oldExerciseId }) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ workoutId, newExerciseId }) =>
      changeExercise({ workoutId, sessionId, oldExerciseId, newExerciseId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSessions');
      },
    }
  );
};
