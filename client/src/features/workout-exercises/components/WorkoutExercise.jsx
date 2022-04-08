import React from 'react';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import WorkoutExerciseLog from './WorkoutExerciseLog';
import { Button } from 'features/common/Button';

export const WorkoutExercise = ({ workoutId, exerciseId }) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.workout) {
    return <p>none available...</p>;
  }

  const addSet = () => {};
  const nextExercise = () => {};

  return (
    <div>
      <OverviewRow
        order="A1"
        name={data.workout.exercises[0].name}
        sets="sets 3"
        reps="reps 10-12"
        rir="rir 1"
        rest="REST 90 seconds"
      />
      <div className="box-border h-32 text-center w-auto">
        {data.workout.exercises[0].video}
      </div>
      <WorkoutExerciseLog workoutId={workoutId} exerciseId={exerciseId} />
      <div className="flex justify-around">
        <Button onClick={addSet}>+ Add Set</Button>
        <Button>Notes</Button>
      </div>
      <div className="flex justify-center py-1">
        <Button onClick={nextExercise}>Next Exercise</Button>
      </div>
    </div>
  );
};
