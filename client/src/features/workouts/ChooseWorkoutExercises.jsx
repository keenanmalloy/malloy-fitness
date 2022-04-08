import React, { useState } from 'react';
import { Input } from 'features/form/Input';
import { Button } from 'features/common/Button';
import FullPageModal from 'features/common/FullPageModal';
import { ChooseWorkoutExerciseList } from './ChooseWorkoutExerciseList';
import { IoMdClose } from 'react-icons/io';

export const ChooseWorkoutExercises = ({ exercises, setExercises }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Button type="button" onClick={openModal} className="w-full mt-2">
        Choose exercises
      </Button>
      <FullPageModal isOpen={isOpen} closeModal={closeModal} isFull>
        <div className="sticky top-0 bg-white z-40">
          <button className="absolute top-2 z-50 right-0">
            <IoMdClose onClick={closeModal} />
          </button>
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
      </FullPageModal>
    </>
  );
};
