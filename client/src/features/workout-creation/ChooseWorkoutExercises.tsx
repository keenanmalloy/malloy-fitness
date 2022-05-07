import React, { useState } from 'react';
import { Input } from 'features/form/Input';
import { Button } from 'features/common/Button';
import FullPageModal from 'features/modal/FullPageModal';
import { ChooseWorkoutExerciseList } from './ChooseWorkoutExerciseList';
import { IoMdClose } from 'react-icons/io';
import { Exercise } from 'features/exercises/types';
import { LocalExercise } from './CreateWorkout';

interface Props {
  exercises: LocalExercise[];
  setExercises: (exercises: LocalExercise[]) => void;
}

export const ChooseWorkoutExercises = ({ exercises, setExercises }: Props) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Button type="button" onClick={openModal} className="w-full mt-2">
        Choose exercises
      </Button>
      <FullPageModal isOpen={isOpen} closeModal={closeModal}>
        <header className="sticky top-0 bg-white z-40 flex flex-col justify-between">
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-2xl font-bold">Exercises</h2>
            {!!exercises.length && (
              <button className="text-blue-500" onClick={closeModal}>
                Add ({exercises.length})
              </button>
            )}
          </div>
          <div className="flex items-center">
            <button className="z-50 px-3">
              <IoMdClose onClick={closeModal} />
            </button>
            <div className="w-full">
              <Input
                onChange={handleQuery}
                value={query}
                isRequired
                type="search"
                placeholder={'Search'}
                label={''}
              />
            </div>
          </div>
        </header>
        <ChooseWorkoutExerciseList
          query={query}
          exercises={exercises}
          setExercises={setExercises}
        />
      </FullPageModal>
    </>
  );
};