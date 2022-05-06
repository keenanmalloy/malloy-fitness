import { MdOutlineRotateRight } from 'react-icons/md';
import React, { useState } from 'react';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';
import { useRotateExercise } from './useRotateExercise';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { isError, isLoading, mutate, error } = useRotateExercise({
    exerciseId,
    sessionId,
  });

  const handleRotation = async () => {
    mutate(
      { workoutId },
      {
        onSuccess: (data) => {
          setIsOpen(false);
          router.push(`/sessions/${sessionId}/exercises/${data.exerciseId}`);
        },
      }
    );
  };

  return (
    <>
      <div className="flex justify-between py-5">
        <Button
          className="flex justify-between px-10"
          onClick={() => setIsOpen(false)}
        >
          No
        </Button>
        <Button className="flex justify-between px-10" onClick={handleRotation}>
          {isLoading ? 'Rotating...' : 'Yes'}
        </Button>
      </div>
      {isError && (
        <div className="text-red-500">
          {error?.response?.data?.message
            ? error?.response?.data?.message
            : 'Something went wrong, please try again'}
        </div>
      )}
    </>
  );
};
