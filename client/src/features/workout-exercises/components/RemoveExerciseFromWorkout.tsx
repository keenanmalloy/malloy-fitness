import React, { FormEvent, useState } from 'react';
import Modal from 'features/modal/Modal';
import { Button } from 'features/common/Button';
import { useQueryClient } from 'react-query';
import { useRemoveExerciseFromWorkoutMutation } from 'features/workout-exercises/api/useRemoveExerciseFromWorkoutMutation';
import { DefaultModal } from 'features/modal/DefaultModal';
import { BiX } from 'react-icons/bi';

interface Props {
  workoutId: string;
  exerciseId: string;
}
export const RemoveExerciseFromWorkout = ({ workoutId, exerciseId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useRemoveExerciseFromWorkoutMutation();
  const queryCLient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { workoutId, exerciseId },
      {
        onSuccess: () => {
          queryCLient.refetchQueries('fetchWorkout');
        },
      }
    );
  }

  return (
    <div>
      <button className="py-2 px-3" onClick={openModal}>
        <BiX />
      </button>
      <DefaultModal
        isOpen={isOpen}
        closeModal={closeModal}
        title="Remove exercise"
        description="Are you sure you want to remove this exercise from your workout?"
      >
        <form onSubmit={handleSubmit}>
          <div className="pt-3 w-full flex space-x-3">
            <Button type="button" className="w-full" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" isDisabled={isLoading}>
              {isLoading ? 'Removing...' : 'Remove'}
            </Button>
            {isError && (
              <small className="text-red-500">Something went wrong...</small>
            )}
          </div>
        </form>
      </DefaultModal>
    </div>
  );
};
