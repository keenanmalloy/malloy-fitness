import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import WorkoutExerciseHeader from 'features/workout-header/WorkoutExerciseHeader';
import Modal from 'features/common/Modal';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const workoutId = params && params.workoutId;

  return {
    props: { workoutId },
  };
}

const EndPage = ({ workoutId, endedAt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const endWorkout = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}/end`,
      {
        method: 'PATCH',
        credentials: 'include',
      }
    );
    const json = await res.json();
    return json;
  };

  const handleStop = () => {
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
    <div>
      <WorkoutExerciseHeader workoutId={workoutId} />
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
