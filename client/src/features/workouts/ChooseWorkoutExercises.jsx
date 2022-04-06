import React, { useState } from 'react';
import { CreateWorkout } from 'features/workouts/CreateWorkout';
import { useExercisesQuery } from 'features/exercises/useExercisesQuery';
import { Input } from 'features/form/Input';
import { GetAllExercises } from 'features/exercises/GetAllExercises';
import { ExerciseList } from 'features/exercises/ExerciseList';
import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import { ChooseWorkoutExerciseList } from './ChooseWorkoutExerciseList';

export const ChooseWorkoutExercises = ({ exercises, setExercises }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    console.log('clicked');
    setIsOpen(true);
  }

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Button type="button" onClick={openModal}>
        Choose exercises
      </Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        {exercises.join(', ')}

        <div className="sticky top-10 bg-white">
          <Input
            onChange={handleQuery}
            value={query}
            label="search"
            isRequired
            type="search"
            autoFocus
          />
        </div>
        <ChooseWorkoutExerciseList
          query={query}
          exercises={exercises}
          setExercises={setExercises}
        />
      </Modal>
    </>
  );
};
