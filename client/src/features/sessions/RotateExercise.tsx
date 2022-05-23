import { MdOutlineRotateRight } from 'react-icons/md';
import React, { useState } from 'react';
import Modal from 'features/modal/Modal';
import { Button } from 'features/common/Button';
import { useRotateExercise } from './useRotateExercise';
import { useRouter } from 'next/router';
import { DefaultModal } from 'features/modal/DefaultModal';

interface Props {
  sessionId: string;
  exerciseId: string;
  workoutId: string;
  workoutTaskExerciseId: string;
  workoutTaskId: string;
}

export const RotateExercise = ({
  sessionId,
  exerciseId,
  workoutId,
  workoutTaskExerciseId,
  workoutTaskId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <button className="py-4" onClick={() => setIsOpen(!isOpen)}>
        <MdOutlineRotateRight className="w-10 h-5" />
      </button>

      <DefaultModal
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
          workoutTaskExerciseId={workoutTaskExerciseId}
          workoutTaskId={workoutTaskId}
        />
      </DefaultModal>
    </div>
  );
};

interface RotateConfirmationPanelProps {
  setIsOpen: (b: boolean) => void;
  sessionId: string;
  exerciseId: string;
  workoutId: string;
  workoutTaskExerciseId: string;
  workoutTaskId: string;
}

const RotateConfirmationPanel = ({
  setIsOpen,
  sessionId,
  exerciseId,
  workoutId,
  workoutTaskExerciseId,
  workoutTaskId,
}: RotateConfirmationPanelProps) => {
  const { isError, isLoading, mutate, error } = useRotateExercise({
    exerciseId,
    sessionId,
  });

  const handleRotation = async () => {
    mutate(
      { workoutId, workoutTaskExerciseId, workoutTaskId },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <div className="flex justify-between pt-5 space-x-2">
        <Button
          className="flex justify-center w-full "
          onClick={() => setIsOpen(false)}
        >
          No
        </Button>
        <Button
          className="flex justify-center w-full "
          onClick={handleRotation}
        >
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
