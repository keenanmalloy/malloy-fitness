import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useSessionQuery } from 'features/sessions/useSessionQuery';
import { RiTimerFill } from 'react-icons/ri';
import SessionTimer from 'features/sessions/SessionTimer';
import { useRouter } from 'next/router';
import { RotateExercise } from './RotateExercise';
import { CgSelect } from 'react-icons/cg';

const SessionHeader = ({ sessionId, exerciseId, workoutId }) => {
  const router = useRouter();
  const { data, isError, isLoading } = useSessionQuery(sessionId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data) {
    return <p>none available...</p>;
  }

  return (
    <header className="flex justify-between fixed top-0 left-0 right-0 bg-gray-50">
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
        <button className="py-4">
          <CgSelect className="w-10 h-5" />
        </button>

        <RotateExercise
          exerciseId={exerciseId}
          sessionId={sessionId}
          workoutId={workoutId}
        />
      </div>
    </header>
  );
};

export default SessionHeader;
