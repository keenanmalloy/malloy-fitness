import React from 'react';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import { Notes } from './Notes';
import { GetSessionExerciseResponse } from './types';
import { SessionFooter } from './SessionFooter';

interface Props {
  sessionId: string;
  exerciseId: string;
  data: GetSessionExerciseResponse;
}

export const SessionExercise = ({ sessionId, exerciseId, data }: Props) => {
  return (
    <main className="pb-20 pt-16">
      <div className="px-3 py-5 " />

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
