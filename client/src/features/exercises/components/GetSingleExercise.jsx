import React from 'react';
import { DeleteExercise } from 'features/exercises/components/DeleteExercise';
import { useExerciseQuery } from 'features/exercises/api/useExerciseQuery';
import { UpdateExercise } from 'features/exercises/components/UpdateExercise';
import { useMuscleGroupsQuery } from 'features/muscle-groups/api/useMuscleGroupsQuery';

export const GetSingleExercise = ({ id }) => {
  const { data, isError, isLoading } = useExerciseQuery(id);
  const {
    data: mgData,
    isError: mgIsError,
    isLoading: mgIsLoading,
  } = useMuscleGroupsQuery();

  if (isLoading || mgIsLoading) {
    return <p>loading...</p>;
  }

  if (isError || mgIsError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (data && !data.exercise) {
    return <p>none available...</p>;
  }

  return (
    <div>
      <div>
        <p>name: {data.exercise.name}</p>
        <p>description: {data.exercise.description}</p>
        <p>profile: {data.exercise.profile}</p>
        <p>
          primary muscle group:{' '}
          {data.exercise.primary.map((group) => group.name)}
        </p>
        <p>
          secondary muscle group:
          {data.exercise.secondary.map((group) => group.name)}
        </p>
        <p>created by: {data.exercise.created_by}</p>
        <p>id: {data.exercise.exercise_id}</p>
      </div>

      <UpdateExercise
        exercise={data.exercise}
        muscleGroups={mgData.muscleGroups}
        queryKey="fetchExercise"
      />
      <DeleteExercise exerciseId={data.exercise.exercise_id} />
    </div>
  );
};
