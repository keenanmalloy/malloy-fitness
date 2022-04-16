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
  return (
    <main className="pb-20">
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
        <div className="pb-5">
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

      <Footer nextEx={nextEx} prevEx={prevEx} workoutId={workoutId} />
    </main>
  );
};

const Footer = ({ prevEx, nextEx, workoutId }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between py-3 px-3 fixed bottom-0 bg-white left-0 right-0 ">
      {!!prevEx.order && (
        <Button
          className="w-full"
          onClick={() =>
            router.push(
              `/workouts/${workoutId}/exercises/${prevEx.order.exercise_id}`
            )
          }
        >
          Previous
        </Button>
      )}

      {!!nextEx.order && (
        <Button
          className="w-full"
          onClick={() =>
            router.push(
              `/workouts/${workoutId}/exercises/${nextEx.order.exercise_id}`
            )
          }
        >
          Next
        </Button>
      )}

      {!nextEx.order && (
        <Button
          className="w-full"
          onClick={() => router.push(`/workouts/${workoutId}/end`)}
        >
          Finish Workout
        </Button>
      )}
    </div>
  );
};
