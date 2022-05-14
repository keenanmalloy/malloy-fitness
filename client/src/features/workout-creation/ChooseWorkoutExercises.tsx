import React, { useState } from 'react';
import { Input } from 'features/form/Input';
import { Button } from 'features/common/Button';
import FullPageModal from 'features/modal/FullPageModal';
import { ChooseWorkoutExerciseList } from './ChooseWorkoutExerciseList';
import { IoMdClose } from 'react-icons/io';
import { Exercise } from 'features/exercises/types';
import { LocalExercise } from './CreateWorkout';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  exercises: LocalExercise[];
  setExercises: (exercises: LocalExercise[]) => void;
}

export const ChooseWorkoutExercises = ({ exercises, setExercises }: Props) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [superset, setSuperset] = useState<null | string>(null);

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
            {!!exercises.length ? (
              <div>
                <button
                  className={`
                  ${superset ? 'text-green-500 ' : 'text-green-700 '}
                  py-3 
                  px-2 
                  ${superset ? 'opacity-100' : 'opacity-30'}
                  `}
                  onClick={() => setSuperset(superset ? null : uuidv4())}
                >
                  Superset
                </button>
                <button
                  className={`opacity-100 
                  text-blue-500
                  p-3`}
                  onClick={closeModal}
                >
                  Add ({exercises.length})
                </button>
              </div>
            ) : (
              <button className="z-50 p-3">
                <IoMdClose onClick={closeModal} />
              </button>
            )}
          </div>
          <div className="flex items-center">
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
          superset={superset}
        />
      </FullPageModal>
    </>
  );
};
