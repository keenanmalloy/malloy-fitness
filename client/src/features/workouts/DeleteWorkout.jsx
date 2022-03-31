import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDeleteWorkoutMutation } from './useDeleteWorkoutMutation';

export const DeleteWorkout = ({ workoutId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useDeleteWorkoutMutation(workoutId);

  const queryCLient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    console.log('clicked');
    setIsOpen(true);
  }

  const handleClick = ({ workoutId }) => {
    mutate(
      { workoutId },
      {
        onSuccess: () => {
          queryCLient.refetchQueries('fetchWorkouts');
        },
      }
    );
  };

  return (
    <>
      <Button onClick={openModal}>Delete workout</Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">Are you sure?</h2>
          <p>This workout will be removed. This action is permanent.</p>
          <div className="flex flex-col">
            <Button
              className="mt-4"
              onClick={() => handleClick(workoutId)}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
            {isError && (
              <small className="text-red-500">Something went wrong...</small>
            )}
            <Button className="mt-4" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
