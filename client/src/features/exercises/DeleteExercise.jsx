import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDeleteExerciseMutation } from './useDeleteExerciseMutation';

export const DeleteExercise = ({ exerciseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useDeleteExerciseMutation(exerciseId);

  const queryCLient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    console.log('clikjed');
    setIsOpen(true);
  }

  const handleClick = (exerciseId) => {
    mutate(
      { exerciseId },
      {
        onSuccess: () => {
          queryCLient.refetchQueries('fetchExercise');
        },
      }
    );
  };

  return (
    <>
      <Button onClick={openModal}>Delete exercise</Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">Are you sure?</h2>
          <p>
            This exercise will be removed from your workout. This action is
            permanent.
          </p>
          <div className="flex flex-col">
            <Button
              className="mt-4"
              disabled={isLoading}
              onClick={() => handleClick(exerciseId)}
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
