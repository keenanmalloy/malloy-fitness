import React from 'react';
import { useSetsByExerciseQuery } from './useSetsByExerciseQuery';

export const SetsByExercise = ({ workoutId, exerciseId }) => {
  const { data, isError, isLoading } = useSetsByExerciseQuery(
    workoutId,
    exerciseId
  );

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log({ data });
  return <div>SetsByExercise</div>;
};
