import React from 'react';
import { useSetsByExerciseQuery } from 'features/sets/api/useSetsByExerciseQuery';
import { Button } from 'features/common/Button';
import { Set } from 'features/sets/components/Set';
import { useCreateSetMutation } from '../api/useCreateSetMutation';
import { Skeleton } from 'features/common/Skeleton';

export const GetExerciseSets = ({ workoutId, exerciseId }) => {
  const { data, isError, isLoading } = useSetsByExerciseQuery({
    workoutId,
    exerciseId,
  });

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex w-full items-stretch pt-2">
          <div className="flex w-full pl-5">
            <Skeleton className="h-10 rounded-md w-full items-stretch" />
          </div>
          <div className="flex w-full pr-5">
            <Skeleton className="h-10 rounded-md w-full items-stretch" />
          </div>
        </div>
        <div className="flex w-full items-stretch pt-2">
          <div className="flex w-full pl-5">
            <Skeleton className="h-10 rounded-md w-full items-stretch" />
          </div>
          <div className="flex w-full pr-5">
            <Skeleton className="h-10 rounded-md w-full items-stretch" />
          </div>
        </div>
      </div>
    );
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
        {sets
          .sort((a, b) => a.set_order - b.set_order)
          .map((set, key) => {
            return (
              <Set
                set={set}
                key={set.set_id}
                setNumber={key + 1 > 9 ? `${key + 1}` : `0${key + 1}`}
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
              set_order: !!sets.length
                ? sets.sort((a, b) => b.set_order - a.set_order)[0].set_order +
                  1
                : 1,
            })
          }
          className="w-full mx-2"
        >
          + Add Set
        </Button>
      </div>
    </section>
  );
};
