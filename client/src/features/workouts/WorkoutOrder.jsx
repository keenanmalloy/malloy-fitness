import { Button } from 'features/common/Button';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateWorkoutExerciseMutation } from './useUpdateWorkoutExerciseMutation';

const WorkoutOrder = ({ exercise, workoutId }) => {
  const { isLoading, mutate, isError } = useUpdateWorkoutExerciseMutation(
    workoutId,
    exercise.exercise_id
  );

  const queryClient = useQueryClient();

  const incrementOrder = () => {
    mutate(
      {
        order: exercise.order + 1,
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries('fetchWorkout');
        },
      }
    );
  };

  const decrementOrder = () => {
    mutate(
      {
        order: exercise.order - 1,
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
      <p>order: {exercise.order}</p>
      <p>priority: {exercise.priority}</p>

      <Button onClick={incrementOrder}>Order Up</Button>
      <Button isDisabled={exercise.order === 1} onClick={decrementOrder}>
        Order Down
      </Button>
    </div>
  );
};

export default WorkoutOrder;
