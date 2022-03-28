import React, { useState } from 'react';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    fetch(
      `http://localhost:4000/workouts/${workoutId}/exercises/${exerciseId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw Error('could not remove exercise');
        }
        closeModal();
      })
      .catch((err) => {
        setError(err.message);
      });
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
          <Button type="submit">Remove Exercise</Button>
        </form>
      </Modal>
    </div>
  );
};
