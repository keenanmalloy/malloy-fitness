import React from 'react';
import { useSetsByExerciseQuery } from 'features/sets/api/useSetsByExerciseQuery';
import { Button } from 'features/common/Button';
import { Set } from 'features/sets/components/Set';
import { useCreateSetMutation } from '../api/useCreateSetMutation';
import { Skeleton } from 'features/common/Skeleton';
import { CgSpinner } from 'react-icons/cg';

interface Props {
  sessionId: string;
  exerciseId: string;
  record: {
    repeptitions: number;
    weight: number;
  }[];
}

export const GetExerciseSets = ({ sessionId, exerciseId, record }: Props) => {
  const { data, isError, isLoading } = useSetsByExerciseQuery({
    sessionId,
    exerciseId,
  });

  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <SetsList
      sets={data?.sets ?? []}
      sessionId={sessionId}
      exerciseId={exerciseId}
      record={record}
    />
  );
};

interface SetsListProps extends Props {
  sets: any[];
}

const SetsList = ({ sets, sessionId, exerciseId, record }: SetsListProps) => {
  const { isLoading, mutate, isError } = useCreateSetMutation(sessionId);

  return (
    <section className="px-3 w-full flex flex-col items-center py-5 text-white">
      {!!sets.length && (
        <div
          className="text-xs flex items-center justify-between w-full text-right"
          style={{ maxWidth: '480px' }}
        >
          <div className="" style={{ width: '41px' }} />
          <p className="flex-1 pr-1">Weight (lbs)</p>
          <p className="flex-1 pr-2">Reps</p>
          <div className="" style={{ width: '24px' }} />
        </div>
      )}

      <ul className="pb-3 max-w-md">
        {sets
          .sort((a, b) => a.set_order - b.set_order)
          .map((set, key) => {
            return (
              <Set
                set={set}
                key={set.set_id}
                setNumber={key + 1 > 9 ? `${key + 1}` : `0${key + 1}`}
                sessionId={sessionId}
                exerciseId={exerciseId}
                // @ts-ignore
                setRecord={record[key]}
              />
            );
          })}
      </ul>

      <button
        onClick={() =>
          mutate({
            exercise_id: exerciseId,
            set_order: !!sets.length
              ? sets.sort((a, b) => b.set_order - a.set_order)[0].set_order + 1
              : 1,
          })
        }
        className="w-full max-w-md flex justify-center bg-slate-700 py-3 rounded-md"
      >
        {isLoading ? (
          <CgSpinner size={20} className="animate-spin text-blue-50" />
        ) : (
          'Add Set'
        )}
      </button>
    </section>
  );
};
