import { MdOutlineRotateRight } from 'react-icons/md';
import React, { useState } from 'react';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';

export const RotateExercise = ({ sessionId, exerciseId, workoutId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <button className="py-4" onClick={() => setIsOpen(!isOpen)}>
        <MdOutlineRotateRight className="w-10 h-5" />
      </button>

      <Modal
        isOpen={isOpen}
        title="Rotate with similar exercise"
        description={'Are you sure you want rotate the exercise?'}
        closeModal={() => setIsOpen(false)}
      >
        <RotateConfirmationPanel
          setIsOpen={setIsOpen}
          sessionId={sessionId}
          exerciseId={exerciseId}
          workoutId={workoutId}
        />
      </Modal>
    </div>
  );
};

const RotateConfirmationPanel = ({
  setIsOpen,
  sessionId,
  exerciseId,
  workoutId,
}) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);
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

  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <Decisions
      hasSessions={data.workout.hasSessions}
      setIsOpen={setIsOpen}
      sessionId={sessionId}
      exerciseId={exerciseId}
      workoutId={workoutId}
    />
  );
};

const Decisions = ({
  hasSessions,
  setIsOpen,
  sessionId,
  exerciseId,
  workoutId,
}) => {
  const handleRotation = async () => {
    if (hasSessions) {
      setIsConfirmed(!isConfirmed);
      return;
    }

    // no sessions
    console.log('no sessions!');
    // await rotateSession({ workoutId: workoutId });
  };

  return (
    <div className="flex justify-between py-5">
      <Button
        className="flex justify-between px-10"
        onClick={() => setIsOpen(false)}
      >
        No
      </Button>
      <Button className="flex justify-between px-10" onClick={handleRotation}>
        Yes
      </Button>
    </div>
  );
};
