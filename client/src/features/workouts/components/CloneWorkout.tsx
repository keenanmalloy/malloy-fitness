import { Button } from 'features/common/Button';
import Modal from 'features/modal/Modal';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useCloneWorkoutMutation } from 'features/workouts/api/useCloneWorkoutMutation';
import { useRouter } from 'next/router';
import { DefaultModal } from 'features/modal/DefaultModal';

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
    <DefaultModal
      title="This workout has previous sessions connected. We recommend you copy it if you wish to change it."
      description="If you edit this workout without copying, your past connected sessions will be updated."
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="flex flex-col">
        <div className="flex justify-between">
          <button
            className="mt-4 bg-red-800 text-white px-4 py-2 rounded shadow"
            onClick={closeModal}
          >
            I understand
          </button>

          <Button
            className="mt-4"
            onClick={() => handleClick()}
            isDisabled={isLoading}
          >
            {isLoading ? 'Copying...' : 'Copy'}
          </Button>
        </div>
        {isError && (
          <small className="text-red-500">Something went wrong...</small>
        )}
      </div>
    </DefaultModal>
  );
};
