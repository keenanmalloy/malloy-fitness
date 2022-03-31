import { Button } from 'features/common/Button';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateWorkoutExerciseMutation } from './useUpdateWorkoutExerciseMutation';

const WorkoutPriority = ({ exercise, workoutId }) => {
  const { isLoading, mutate, isError } = useUpdateWorkoutExerciseMutation(
    workoutId,
    exercise.exercise_id
  );

  const queryClient = useQueryClient();
  const incrementPriority = () => {
    mutate(
      {
        priority: exercise.priority + 1,
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries('fetchWorkout');
        },
      }
    );
  };

  const decrementPriority = () => {
    mutate(
      {
        priority: exercise.priority - 1,
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries('fetchWorkout');
        },
      }
    );
  };
  return (
    <div>
      <Button onClick={incrementPriority}>Priority Up</Button>
      <Button isDisabled={exercise.priority === 1} onClick={decrementPriority}>
        Priority Down
      </Button>
    </div>
  );
};

export default WorkoutPriority;
