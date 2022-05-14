import { Button } from 'features/common/Button';
import Modal from 'features/modal/Modal';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDeleteExerciseMutation } from 'features/exercises/api/useDeleteExerciseMutation';
import { MdDelete } from 'react-icons/md';
import { DefaultModal } from 'features/modal/DefaultModal';

interface Props {
  exerciseId: string;
}

export const DeleteExercise = ({ exerciseId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useDeleteExerciseMutation(exerciseId);

  const queryCLient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const handleClick = (exerciseId: string) => {
    mutate(undefined, {
      onSuccess: () => {
        queryCLient.refetchQueries('fetchExercise');
        setIsOpen(false);
      },
    });
  };

  return (
    <>
      <Button onClick={openModal} className="px-0 py-0">
        <MdDelete className="h-6 w-10" />
      </Button>
      <DefaultModal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">Are you sure?</h2>
          <p>
            This exercise will be removed from your workout. This action is
            permanent.
          </p>
          <div className="flex flex-col">
            <Button
              className="mt-4"
              isDisabled={isLoading}
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
      </DefaultModal>
    </>
  );
};
