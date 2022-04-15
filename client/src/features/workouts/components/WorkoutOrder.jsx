import { Button } from 'features/common/Button';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateWorkoutExerciseMutation } from 'features/workout-exercises/api/useUpdateWorkoutExerciseMutation';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';

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
    <div className="flex flex-col w-12">
      <Button isDisabled={exercise.order === 1} onClick={decrementOrder}>
        <AiOutlineCaretUp />
      </Button>
      <Button onClick={incrementOrder}>
        <AiOutlineCaretDown />
      </Button>
    </div>
  );
};

export default WorkoutOrder;
