import React from 'react';
import { useSetsByExerciseQuery } from './useSetsByExerciseQuery';

export const SetsByExercise = ({ workoutId, exerciseId }) => {
  const { data, isError, isLoading } = useSetsByExerciseQuery(
    workoutId,
    exerciseId
  );

  console.log({ data });

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>SetsByExercise</div>;
};
