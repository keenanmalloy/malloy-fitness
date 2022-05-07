import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface AddExerciseToSessionParams {
  workoutId: string;
  sessionId: string;
  exerciseId: string;
}

const addExerciseToSession = async ({
  workoutId,
  exerciseId,
  sessionId,
}: AddExerciseToSessionParams) => {
  const { data } = await apiClient.post(`/sessions/${sessionId}/exercises`, {
    workout_id: workoutId,
    exercise_id: exerciseId,
  });
  return data;
};

export const useAddExerciseToSessionMutation = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { workoutId: string; exerciseId: string }>(
    ({ workoutId, exerciseId }) =>
      addExerciseToSession({ workoutId, exerciseId, sessionId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSession');
      },
    }
  );
};
