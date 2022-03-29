import React from 'react';
import { ExerciseList } from './ExerciseList';
import { Button } from '../common/Button';
import { useExercisesQuery } from './useExercisesQuery';

export const GetAllExercises = () => {
  const { data, isError, isLoading } = useExercisesQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.exercises) {
    return <p>none available...</p>;
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ExerciseList exercises={data.exercises} />
      )}

      <Button href="/exercises/create">Create exercise</Button>
    </div>
  );
};
