import React from 'react';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import StartWorkout from 'features/workouts/components/StartWorkout';

export const OverviewExercises = ({ workoutId }) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);

  console.log({ data });

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
        {data.workout.exercises.map((ex, key) => {
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
        workoutId={workoutId}
        hasStarted={!!data.workout.started_at}
        hasEnded={!!data.workout.ended_at}
      />
    </div>
  );
};
