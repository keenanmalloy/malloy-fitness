import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useSessionQuery } from 'features/sessions/useSessionQuery';
import { RiTimerFill } from 'react-icons/ri';
import SessionTimer from 'features/sessions/SessionTimer';
import { useRouter } from 'next/router';
import { RotateExercise } from './RotateExercise';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import { ChangeExercise } from './ChangeExercise';

const SessionHeader = ({ sessionId, exerciseId, workoutId }) => {
  const router = useRouter();
  const { data, isError, isLoading } = useSessionQuery(sessionId, exerciseId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data) {
    return <p>none available...</p>;
  }

  const currentExercise = data.session.exercises.find(
    (ex) => ex.exercise_id === exerciseId
  );

  const getLetter = (index) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-50 z-10">
      <section className="flex justify-between border-solid border-gray-600">
        <div className="flex justify-between items-center w-full">
          <button onClick={() => router.push('/workouts')} className="py-4">
            <BiArrowBack className="w-10 h-4" />
          </button>

          <h2 className="capitalize overflow-clip text-ellipsis text-sm">
            {data.session.name}
          </h2>

          <div className="flex px-2">
            <RiTimerFill />
            <SessionTimer
              endedAt={data.session.ended_at}
              startedAt={data.session.started_at}
            />
          </div>
        </div>

        <div className="flex">
          <ChangeExercise
            exercises={data.session.exercises}
            exerciseId={exerciseId}
            sessionId={sessionId}
            workoutId={workoutId}
          />
          <RotateExercise
            exerciseId={exerciseId}
            sessionId={sessionId}
            workoutId={workoutId}
          />
        </div>
      </section>
      <div className="px-1 pt-0.5 border-solid border-gray-200 border-t">
        <OverviewRow
          order={`${getLetter(currentExercise.order - 1)}1`}
          name={currentExercise.name}
          sets="sets 3"
          reps="reps 10-12"
          rir="rir 1"
          rest="REST 90 seconds"
        />
      </div>
    </header>
  );
};

export default SessionHeader;
