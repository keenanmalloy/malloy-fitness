import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useSessionQuery } from 'features/sessions/useSessionQuery';
import { RiTimerFill } from 'react-icons/ri';
import SessionTimer from 'features/sessions/SessionTimer';
import { useRouter } from 'next/router';

const SessionHeader = ({ sessionId }) => {
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
    <div className="flex w-auto h-8 justify-around items-center py-5 bg-gray-50">
      <BiArrowBack onClick={() => router.push('/workouts')} />

      <h2>{data.session.name}</h2>

      <div className="flex">
        <RiTimerFill />
        <div>
          <SessionTimer
            endedAt={data.session.ended_at}
            startedAt={data.session.started_at}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;
