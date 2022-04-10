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
        <header className="sticky top-0 bg-white z-40 flex justify-between">
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
            />
          </div>
        </header>
        <ChooseWorkoutExerciseList
          query={query}
          exercises={exercises}
          setExercises={setExercises}
        />
        <Button onClick={closeModal} className="w-full mt-2">
          Save
        </Button>
      </FullPageModal>
    </>
  );
};
