import React from 'react';
import { useSetsByExerciseQuery } from 'features/sets/api/useSetsByExerciseQuery';
import { Button } from 'features/common/Button';
import { Set } from 'features/sets/components/Set';
import { useCreateSetMutation } from '../api/useCreateSetMutation';

export const GetExerciseSets = ({ workoutId, exerciseId }) => {
  const { data, isError, isLoading } = useSetsByExerciseQuery({
    workoutId,
    exerciseId,
  });

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SetsList sets={data.sets} workoutId={workoutId} exerciseId={exerciseId} />
  );
};

const SetsList = ({ sets, workoutId, exerciseId }) => {
  const { isLoading, mutate, isError } = useCreateSetMutation({ workoutId });

  return (
    <section className="px-3">
      <ul>
        {sets.map((set, key) => {
          return (
            <Set
              set={set}
              key={set.set_id}
              setNumber={`0${key + 1}`}
              workoutId={workoutId}
              exerciseId={exerciseId}
            />
          );
        })}
      </ul>
      <div className="flex justify-end py-5">
        <Button
          onClick={() =>
            mutate({
              exercise_id: exerciseId,
            })
          }
        >
          + Add Set
        </Button>
      </div>
    </section>
  );
};
