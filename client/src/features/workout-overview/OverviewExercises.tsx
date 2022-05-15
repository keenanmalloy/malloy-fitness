import React from 'react';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import StartSession from 'features/sessions/StartSession';
import { useWorkoutSessionQuery } from './useWorkoutSessionQuery';
import { IoClose } from 'react-icons/io5';
import { CgSpinner } from 'react-icons/cg';

interface Props {
  sessionId: string;
  setIsOpen: (isOpen: boolean) => void;
}

export const OverviewExercises = ({ sessionId, setIsOpen }: Props) => {
  const { data, isError, isLoading } = useWorkoutSessionQuery(sessionId);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full">
        <CgSpinner className="animate-spin text-green-400" size={24} />
      </div>
    );
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data) {
    return <p>no data</p>;
  }

  const getLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  return (
    <div className="relative">
      <h1 className="text-lg text-center capitalize">{data.session.name}</h1>
      <button
        className="absolute -top-2 right-0 p-2"
        onClick={() => setIsOpen(false)}
      >
        <IoClose className="w-5 h-5" />
      </button>
      <ul className="pt-2 pb-2 divide-y divide-slate-800">
        {data.session.exercises
          .sort((a, b) => {
            if (!data.session.exercise_order) return 0;
            //sort exercises by exercise_order array
            const exerciseOrder = data.session.exercise_order;
            const aIndex = exerciseOrder.indexOf(a.exercise_id);
            const bIndex = exerciseOrder.indexOf(b.exercise_id);
            return aIndex - bIndex;
          })
          .map((ex, key) => {
            return (
              <OverviewRow
                key={ex.exercise_id}
                order={`${getLetter(key)}1`}
                name={ex.name}
                sets="sets 3"
                reps="reps 10-12"
                rir="rir 1"
                rest="REST 90 seconds"
                exerciseId={ex.exercise_id}
              />
            );
          })}
      </ul>

      <StartSession
        sessionId={sessionId}
        hasStarted={!!data.session.started_at}
        hasEnded={!!data.session.ended_at}
        hasExercises={!data.session.exercises.length}
      />
    </div>
  );
};
