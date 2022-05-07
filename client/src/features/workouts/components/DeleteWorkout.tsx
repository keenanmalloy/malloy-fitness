import { Button } from 'features/common/Button';
import Modal from 'features/modal/Modal';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDeleteWorkoutMutation } from 'features/workouts/api/useDeleteWorkoutMutation';
import { MdDelete } from 'react-icons/md';
import { useRouter } from 'next/router';

interface Props {
  workoutId: string;
}

export const DeleteWorkout = ({ workoutId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useDeleteWorkoutMutation(workoutId);

  const queryClient = useQueryClient();
  const router = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleClick = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.refetchQueries('fetchWorkouts');
        router.push('/workouts');
      },
    });
  };

  return (
    <>
      <Button onClick={openModal} className="px-0 py-2">
        <MdDelete className="h-6 w-10" />
      </Button>
      <Modal
        title="Are you sure?"
        description="This workout will be removed. This action is permanent."
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <div className="flex flex-col">
          <div className="flex justify-between">
            <Button
              className="mt-4"
              onClick={() => handleClick()}
              isDisabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>

            <Button className="mt-4" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          {isError && (
            <small className="text-red-500">Something went wrong...</small>
          )}
        </div>
      </Modal>
    </>
  );
};
