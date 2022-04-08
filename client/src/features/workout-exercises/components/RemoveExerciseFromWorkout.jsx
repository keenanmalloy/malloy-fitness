import React, { useState } from 'react';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';
import { useQueryClient } from 'react-query';
import { useRemoveExerciseFromWorkoutMutation } from 'features/workout-exercises/api/useRemoveExerciseFromWorkoutMutation';

/**
 * A component that contains the logic to remove an exercise from a workout.
 * DELETE /workouts/:workoutId/exercises/:exerciseId
 *
 * The behaviour of this component should be:
 * 1. User clicks button with the intent to remove an exercise from their workout.
 * 2. Modal opens with details about removing the exercise and a button to click which sends the request.
 * 3. User clicks button in modal which removes the exercise from the workout.
 */
export const RemoveExerciseFromWorkout = ({ workoutId, exerciseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useRemoveExerciseFromWorkoutMutation();
  const queryCLient = useQueryClient();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleSubmit(e) {
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
      <Button
        className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        onClick={openModal}
      >
        Remove Exercise
      </Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <p>Are you sure you want to remove this exercise from your workout?</p>
        <form onSubmit={handleSubmit}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Removing Exercise...' : 'Remove Exercise'}
          </Button>
          {isError && (
            <small className="text-red-500">Something went wrong...</small>
          )}
        </form>
      </Modal>
    </div>
  );
};
