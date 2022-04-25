import React from 'react';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import StartWorkout from 'features/workouts/components/StartWorkout';
import { useWorkoutSessionQuery } from './useWorkoutSessionQuery';

export const OverviewExercises = ({ sessionId }) => {
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
    <div>
      <ul className="py-5">
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
      <StartWorkout
        sessionId={sessionId}
        hasStarted={!!data.session.started_at}
        hasEnded={!!data.session.ended_at}
      />
    </div>
  );
};
