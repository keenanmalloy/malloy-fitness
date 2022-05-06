import React from 'react';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import StartSession from 'features/sessions/StartSession';
import { useWorkoutSessionQuery } from './useWorkoutSessionQuery';
import { IoClose } from 'react-icons/io5';

export const OverviewExercises = ({ sessionId, setIsOpen }) => {
  const { data, isError, isLoading } = useWorkoutSessionQuery(sessionId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  const getLetter = (index) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  return (
    <div className="relative">
      <h1 className="text-lg text-center capitalize">{data.session.name}</h1>
      <button
        className="absolute top-0 right-0"
        onClick={() => setIsOpen(false)}
      >
        <IoClose className="w-5 h-5" />
      </button>
      <ul className="pt-2 pb-2 divide-y">
        {data.session.exercises
          .sort((a, b) => {
            if (a.order < b.order) {
              return -1;
            }
            if (a.order > b.order) {
              return 1;
            }
            return 0;
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
              />
            );
          })}
      </ul>
      <StartSession
        sessionId={sessionId}
        hasStarted={!!data.session.started_at}
        hasEnded={!!data.session.ended_at}
      />
    </div>
  );
};
