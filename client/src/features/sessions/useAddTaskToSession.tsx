import { apiClient } from 'config/axios';
import { useMutation, useQueryClient } from 'react-query';

interface AddExerciseToSessionParams {
  workoutId: string;
  sessionId: string;
  exerciseIds: string[];
}

const addTaskToSession = async ({
  workoutId,
  exerciseIds,
  sessionId,
}: AddExerciseToSessionParams) => {
  const { data } = await apiClient.post(`/sessions/${sessionId}/tasks`, {
    workoutId,
    exercises: exerciseIds,
  });

  return data;
};

export const useAddTaskToSessionMutation = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { workoutId: string; exerciseIds: string[] }>(
    ({ workoutId, exerciseIds }) =>
      addTaskToSession({ workoutId, exerciseIds, sessionId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('fetchSession');
      },
    }
  );
};
