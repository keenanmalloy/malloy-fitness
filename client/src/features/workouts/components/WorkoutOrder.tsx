import { Button } from 'features/common/Button';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateWorkoutExerciseMutation } from 'features/workout-exercises/api/useUpdateWorkoutExerciseMutation';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { Exercise } from 'features/exercises/types';

interface Props {
  workoutId: string;
  exercise: Exercise;
}

const WorkoutOrder = ({ exercise, workoutId }: Props) => {
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
    <div className="flex flex-col">
      <button
        className="flex items-center justify-center w-full h-full p-2"
        disabled={exercise.order === 1}
        onClick={decrementOrder}
      >
        <AiOutlineCaretUp className="w-4 h-4" />
      </button>
      <button
        className="flex items-center justify-center w-full h-full p-2"
        onClick={incrementOrder}
      >
        <AiOutlineCaretDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default WorkoutOrder;
