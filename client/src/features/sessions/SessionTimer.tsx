import React, { useEffect, useState } from 'react';
import { BsFillStopFill } from 'react-icons/bs';
import Modal from 'features/modal/Modal';
import { Button } from 'features/common/Button';
import { useRouter } from 'next/router';
import { DefaultModal } from 'features/modal/DefaultModal';

interface Props {
  startedAt: string;
  workoutId: string;
  endedAt: string;
}

const SessionTimer = ({ startedAt, workoutId, endedAt }: Props) => {
  const router = useRouter();
  const startTime = new Date(startedAt);
  const currentTime = new Date();
  const diff = Math.floor(
    Math.abs((currentTime.getTime() - startTime.getTime()) / 1000)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const hourInSeconds = 3600;
  const minuteInSeconds = 60;
  const [time, setTime] = useState(diff);
  const formatTime = (time: number) => {
    const hours = Math.floor(time / hourInSeconds);
    const minutes = Math.floor(
      (time - hours * hourInSeconds) / minuteInSeconds
    );
    const seconds = time - hours * hourInSeconds - minutes * minuteInSeconds;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const endWorkout = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}/end`,
      {
        method: 'PATCH',
        credentials: 'include',
      }
    );

    if (!res.ok) throw Error;
    const json = await res.json();
    return json;
  };

  const handleStop = () => {
    // resets the timer, redirects to the workout page
    endWorkout(workoutId)
      .then(() => {
        router.push('/');
      })
      .catch(() => {
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
    <div className="flex">
      <div className="px-1">
        <h2>{formatTime(time)}</h2>
      </div>
      <div className="flex">
        <button onClick={() => setIsOpen(!isOpen)}>
          <BsFillStopFill />
        </button>
        <DefaultModal
          isOpen={isOpen}
          title="Finish workout"
          description={'Are you sure you want to stop the workout early?'}
          closeModal={() => setIsOpen(false)}
        >
          <div className="flex justify-between py-5">
            <Button
              className="flex justify-between px-10"
              onClick={() => setIsOpen(false)}
            >
              No
            </Button>
            <Button
              className="flex justify-between px-10"
              onClick={() => handleStop()}
            >
              Yes
            </Button>
            {error && <p>Something went wrong</p>}
          </div>
        </DefaultModal>
      </div>
    </div>
  );
};

export default SessionTimer;
