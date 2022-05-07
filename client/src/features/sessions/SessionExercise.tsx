import React from 'react';
import { Button } from 'features/common/Button';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import { Notes } from './Notes';
import Link from 'next/link';

interface Props {
  sessionId: string;
  exerciseId: string;
  nextEx: {
    order: {
      exercise_id: string;
    };
  };
  prevEx: {
    order: {
      exercise_id: string;
    };
  };
  exercise: any;
  record: any;
}

export const SessionExercise = ({
  sessionId,
  exerciseId,
  nextEx,
  prevEx,
  exercise,
  record,
}: Props) => {
  return (
    <main className="pb-20 pt-16">
      <div className="px-3 py-5 bg-gray-50" />

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

      <GetExerciseSets
        sessionId={sessionId}
        exerciseId={exerciseId}
        record={record}
      />

      <Notes
        exercise={exercise}
        exNotes={exercise.notes}
        sessionId={sessionId}
        exerciseId={exerciseId}
        workoutId={''}
      />

      <Footer nextEx={nextEx} prevEx={prevEx} sessionId={sessionId} />
    </main>
  );
};

interface SessionFooterProps {
  sessionId: string;
  nextEx: {
    order: {
      exercise_id: string;
    };
  };
  prevEx: {
    order: {
      exercise_id: string;
    };
  };
}

const Footer = ({ prevEx, nextEx, sessionId }: SessionFooterProps) => {
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
