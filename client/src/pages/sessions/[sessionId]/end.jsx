import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import { useRouter } from 'next/router';
import { apiClient } from 'config/axios';
import { useSessionQuery } from 'features/sessions/useSessionQuery';
import { Skeleton } from 'features/common/Skeleton';
import SessionTimer from 'features/sessions/SessionTimer';
import { useSessionSummaryQuery } from 'features/sessions/useSessionSummaryQuery';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const sessionId = params && params.sessionId;

  return {
    props: { sessionId },
  };
}

const EndPage = ({ sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const { data, isError, isLoading } = useSessionSummaryQuery(sessionId);

  const endWorkout = async (id) => {
    const { data } = await apiClient.patch(`/sessions/${id}/end`);
    return data;
  };

  const handleStop = () => {
    endWorkout(sessionId)
      .then(() => {
        router.push('/');
      })
      .catch((e) => {
        console.log({ e });
        setError(true);
      });
  };

  if (isLoading) {
    return (
      <div className="py-5">
        <Skeleton className="h-20 w-full mt-7" />
        <Skeleton className="h-44 w-full mt-1" />
        <Skeleton className="h-28 w-full mt-10" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24 mt-8 mr-4 rounded-md" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-full mt-8 mx-4 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1>Workout Completed!</h1>
        {/* <SessionTimer
          endedAt={data.session.ended_at}
          startedAt={data.session.started_at}
        /> */}

        <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
      </div>
      <div className="flex justify-center">
        <Button onClick={() => setIsOpen(!isOpen)}>End Workout</Button>
        <Modal
          isOpen={isOpen}
          title="End workout"
          description={'Are you sure you want to end the workout'}
          closeModal={() => setIsOpen(false)}
        >
          <div className="flex justify-center">
            <Button onClick={() => setIsOpen(false)}>No</Button>
            <Button onClick={() => handleStop()}>Yes</Button>
            {error && <p>Something went wrong</p>}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EndPage;
