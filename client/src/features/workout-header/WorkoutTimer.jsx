import React, { useEffect, useState } from 'react';
import { BsFillStopFill } from 'react-icons/bs';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';
import { useRouter } from 'next/router';

const WorkoutTimer = ({ startedAt, workoutId }) => {
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
  const formatTime = (time) => {
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

  const endWorkout = async (id) => {
    const res = await fetch(`http://localhost:4000/workouts/${id}/end`, {
      method: 'PATCH',
      credentials: 'include',
    });
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

  return (
    <div className="flex">
      <div className="px-4">
        <h2>{formatTime(time)}</h2>
      </div>
      <div className="flex">
        <BsFillStopFill onClick={() => setIsOpen(!isOpen)} />
        <Modal
          isOpen={isOpen}
          title="Finish workout"
          description={'Are you sure you want to stop the workout early?'}
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

export default WorkoutTimer;
