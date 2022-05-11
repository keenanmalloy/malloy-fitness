import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import { Notes } from './Notes';
import Link from 'next/link';
import { GetSessionExerciseResponse } from './types';
import { MyTimer } from 'features/timers/Timer';
import { TimerType } from 'features/timers/types';

interface Props {
  sessionId: string;
  exerciseId: string;
  data: GetSessionExerciseResponse;
}

export const SessionExercise = ({ sessionId, exerciseId, data }: Props) => {
  return (
    <main className="pb-20 pt-16">
      <div className="px-3 py-5 bg-gray-50" />

      {!!data.exercise.video && (
        <div className="pb-5 w-full">
          <video
            controls
            src={`https://cdn.trckd.ca/${data.exercise.video}`}
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
        record={data.record}
      />

      <Notes
        exercise={data.exercise}
        exNotes={data.exercise.notes}
        exerciseId={exerciseId}
        workoutId={data.exercise.workout_id}
      />

      <Footer nextEx={data.next} prevEx={data.prev} sessionId={sessionId} />
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
  const [timerType, setTimerType] = useState<TimerType>(null);
  const time = new Date();
  return (
    <div>
      <MyTimer
        expiryTimestamp={time}
        timerType={timerType}
        setTimerType={setTimerType}
      />

      <div className="flex justify-between py-3 px-3 fixed bottom-0 bg-white left-0 right-0 ">
        {!!prevEx.order.exercise_id && (
          <Link
            href={`/sessions/${sessionId}/exercises/${prevEx.order.exercise_id}`}
          >
            <Button className="w-full">Previous</Button>
          </Link>
        )}

        {!!nextEx.order.exercise_id && (
          <Link
            href={`/sessions/${sessionId}/exercises/${nextEx.order.exercise_id}`}
          >
            <Button className="w-full">Next</Button>
          </Link>
        )}

        {!nextEx.order.exercise_id && (
          <Link href={`/sessions/${sessionId}/end`}>
            <Button className="w-full">Finish Workout</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
