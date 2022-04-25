import React from 'react';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import { Button } from 'features/common/Button';
import { useRouter } from 'next/router';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import { Notes } from './Notes';
import Link from 'next/link';

export const SessionExercise = ({
  sessionId,
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
        <div className="pb-5 w-full">
          <video
            controls
            src={`https://cdn.trckd.ca/${exercise.video}`}
            className="w-full"
          />
        </div>
      )}

      <div className="flex justify-evenly pt-5">
        <p>Reps</p>
        <p>Weight (LBS)</p>
      </div>
      <GetExerciseSets sessionId={sessionId} exerciseId={exerciseId} />

      {/* <Notes
        exercise={exercise}
        exNotes={exercise.notes}
        sessionId={sessionId}
        exerciseId={exerciseId}
      /> */}

      <Footer nextEx={nextEx} prevEx={prevEx} sessionId={sessionId} />
    </main>
  );
};

const Footer = ({ prevEx, nextEx, sessionId }) => {
  return (
    <div className="flex justify-between py-3 px-3 fixed bottom-0 bg-white left-0 right-0 ">
      {!!prevEx.order && (
        <Link
          href={`/sessions/${sessionId}/exercises/${prevEx.order.exercise_id}`}
        >
          <Button className="w-full">Previous</Button>
        </Link>
      )}

      {!!nextEx.order && (
        <Link
          href={`/sessions/${sessionId}/exercises/${nextEx.order.exercise_id}`}
        >
          <Button className="w-full">Next</Button>
        </Link>
      )}

      {!nextEx.order && (
        <Link href={`/sessions/${sessionId}/end`}>
          <Button className="w-full">Finish Workout</Button>
        </Link>
      )}
    </div>
  );
};
