import React from 'react';
import { Button } from 'features/common/Button';
import { DeleteExercise } from './DeleteExercise';
import { useExerciseQuery } from './useExerciseQuery';

export const GetSingleExercise = ({ id }) => {
  const { data, isError, isLoading } = useExerciseQuery(id);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (data && !data.exercise) {
    return <p>none available...</p>;
  }

  return (
    <div>
      <div>
        <p>{data.exercise.name}</p>
        <p>{data.exercise.description}</p>
        <p>{data.exercise.profile}</p>
        <p>{data.exercise.primary.map((group) => group.name)}</p>
        <p>{data.exercise.secondary.map((group) => group.name)}</p>
        <p>{data.exercise.created_by}</p>
        <p>{data.exercise.exercise_id}</p>
      </div>

      <Button href={`/exercises/update/${data.exercise.exercise_id}`}>
        Update exercise
      </Button>
      <DeleteExercise exerciseId={data.exercise.exercise_id} />
    </div>
  );
};
