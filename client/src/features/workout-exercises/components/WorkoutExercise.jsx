import React, { useState } from 'react';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import { Button } from 'features/common/Button';
import { useRouter } from 'next/router';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import { Notes } from './Notes';

export const WorkoutExercise = ({
  workoutId,
  exerciseId,
  nextEx,
  prevEx,
  exercise,
}) => {
  const router = useRouter();
  const finishWorkout = () => {
    router.push(`/workouts/${workoutId}/end`);
  };

  return (
    <main>
      <div className="px-3 py-5 bg-gray-50">
        <OverviewRow
          order="A1"
          name={exercise.name}
          sets="sets 3"
          reps="reps 10-12"
          rir="rir 1"
          rest="REST 90 seconds"
        />
      </div>

      {!!exercise.video && (
        <div className="py-5">
          <video controls src={`https://cdn.trckd.ca/${exercise.video}`} />
        </div>
      )}

      <div className="flex justify-evenly pt-5">
        <p>Reps</p>
        <p>Weight (LBS)</p>
      </div>
      <GetExerciseSets workoutId={workoutId} exerciseId={exerciseId} />

      <Notes
        exercise={exercise}
        workoutId={workoutId}
        exerciseId={exerciseId}
      />

      <Footer nextEx={nextEx} prevEx={prevEx} />
    </main>
  );
};

const Footer = ({ prevEx, nextEx }) => {
  return (
    <div className="flex justify-between py-3 fixed bottom-0 bg-white left-3 right-3 ">
      <Button
        onClick={
          prevEx.order !== null
            ? () =>
                router.push(
                  `/workouts/${workoutId}/exercises/${prevEx.order.exercise_id}`
                )
            : null
        }
      >
        Previous Exercise
      </Button>
      <Button
        onClick={
          nextEx.order !== null
            ? () =>
                router.push(
                  `/workouts/${workoutId}/exercises/${nextEx.order.exercise_id}`
                )
            : finishWorkout
        }
      >
        {nextEx.order === null ? 'Finish Workout' : 'Next Exercise'}
      </Button>
    </div>
  );
};
