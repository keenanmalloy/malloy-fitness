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
}

export const RotateExercise = ({ sessionId, exerciseId, workoutId }: Props) => {
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
}

const RotateConfirmationPanel = ({
  setIsOpen,
  sessionId,
  exerciseId,
  workoutId,
}: RotateConfirmationPanelProps) => {
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
