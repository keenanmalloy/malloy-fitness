import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import { Notes } from './Notes';
import Link from 'next/link';
import { GetSessionExerciseResponse } from './types';
import { MyTimer } from 'features/timers/Timer';
import { TimerType } from 'features/timers/types';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { SessionFooter } from './SessionFooter';

interface Props {
  sessionId: string;
  exerciseId: string;
  data: GetSessionExerciseResponse;
}

export const SessionExercise = ({ sessionId, exerciseId, data }: Props) => {
  return (
    <main className="pb-20 pt-16">
      <div className="px-3 py-5 bg-gray-50" />

      <div className="flex justify-evenly pt-5">
        <p>Reps</p>
        <p>Weight (LBS)</p>
      </div>

      <GetExerciseSets
        sessionId={sessionId}
        exerciseId={exerciseId}
        record={data.record}
      />

      <Notes
        exercise={data.exercise}
        exNotes={data.exercise.notes}
        exerciseId={exerciseId}
        workoutId={data.exercise.workout_id}
      />

      <SessionFooter
        nextEx={data.next}
        prevEx={data.prev}
        sessionId={sessionId}
      />
    </main>
  );
};
