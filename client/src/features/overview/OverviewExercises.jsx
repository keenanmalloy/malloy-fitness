import WorkoutExercises from 'features/workouts/WorkoutExercises';
import React from 'react';
import { useWorkoutQuery } from 'features/workouts/useWorkoutQuery';
import { OverviewRow } from './OverviewRow';
import StartWorkout from 'features/workouts/StartWorkout';

export const OverviewExercises = ({ workoutId }) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);
  console.log({ data, workoutId });

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.workout) {
    return <p>none available...</p>;
  }

  const getLetter = (index) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  return (
    <div>
      <ul>
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
      <StartWorkout workoutId={workoutId} />
    </div>
  );
};
