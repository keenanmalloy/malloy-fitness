import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import SessionHeader from 'features/sessions/SessionHeader';
import Modal from 'features/common/Modal';
import { useRouter } from 'next/router';
import { apiClient } from 'config/axios';

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

const EndPage = ({ sessionId, endedAt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

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

  if (!!endedAt) {
    return (
      <div className="flex">
        <div className="px-4">
          <h2>
            {formatTime(
              Math.floor(
                Math.abs(
                  (new Date(endedAt).getTime() -
                    new Date(startedAt).getTime()) /
                    1000
                )
              )
            )}
          </h2>
        </div>
      </div>
    );
  }
  return (
    <div>
      <SessionHeader sessionId={sessionId} />
      <div className="flex justify-center">
        <h1>Workout Completed!</h1>
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
