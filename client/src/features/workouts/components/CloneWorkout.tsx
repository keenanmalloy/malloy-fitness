import { Button } from 'features/common/Button';
import Modal from 'features/modal/Modal';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useCloneWorkoutMutation } from 'features/workouts/api/useCloneWorkoutMutation';
import { useRouter } from 'next/router';

interface Props {
  workoutId: string;
  hasSessions: boolean;
}

export const CloneWorkout = ({ workoutId, hasSessions }: Props) => {
  const [isOpen, setIsOpen] = useState(hasSessions);
  const { mutate, isLoading, isError } = useCloneWorkoutMutation(workoutId);

  const router = useRouter();

  const queryClient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
  }

  const handleClick = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workouts/${data.workoutId}`);
        queryClient.refetchQueries('fetchWorkout');
        setIsOpen(false);
      },
    });
  };

  return (
    <Modal
      title="This workout has previous sessions. We recommend you clone it."
      description="If you edit this workout without cloning, all sessions connected will be updated."
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Button className="mt-4" onClick={closeModal}>
            I understand
          </Button>

          <Button
            className="mt-4"
            onClick={() => handleClick()}
            isDisabled={isLoading}
          >
            {isLoading ? 'Cloning...' : 'Clone'}
          </Button>
        </div>
        {isError && (
          <small className="text-red-500">Something went wrong...</small>
        )}
      </div>
    </Modal>
  );
};
