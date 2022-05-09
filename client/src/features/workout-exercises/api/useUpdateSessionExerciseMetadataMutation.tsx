import { useMutation } from 'react-query';
import { apiClient } from 'config/axios';

interface UpdateWorkoutExerciseMetadataMutationProps {
  workoutId: string;
  exerciseId: string;
  body: {
    sets: string;
    repetitions: string;
    repsInReserve: string;
    restPeriod: string;
  };
}

const updateWorkoutExerciseMetadata = async ({
  workoutId,
  exerciseId,
  body,
}: UpdateWorkoutExerciseMetadataMutationProps) => {
  const { data } = await apiClient.patch(
    `/workouts/${workoutId}/exercises/${exerciseId}`,
    body
  );
  return data;
};

interface Props {
  workoutId: string;
  exerciseId: string;
}

export const useUpdateSessionExerciseMetadataMutation = ({
  workoutId,
  exerciseId,
}: Props) => {
  return useMutation<any, any, any>((body) =>
    updateWorkoutExerciseMetadata({ workoutId, exerciseId, body })
  );
};
