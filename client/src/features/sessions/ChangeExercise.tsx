import FullPageModal from 'features/common/FullPageModal';
import React, { useState } from 'react';
import { CgSelect } from 'react-icons/cg';
import { SelectableExerciseList } from './SelectableExercistList';
import { Input } from 'features/form/Input';
import { CreateExercise } from 'features/exercises/components/CreateExercise';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FilterExercises } from 'features/exercises/components/FilterExercises';
import { BiX } from 'react-icons/bi';
import { useChangeExercise } from './useChangeExercise';
import { useRouter } from 'next/router';

export const ChangeExercise = ({
  exercises,
  exerciseId,
  sessionId,
  workoutId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [view, setView] = useState('');
  const [profile, setProfile] = useState('');
  const [sortBy, setSortBy] = useState('');

  const router = useRouter();

  const { data, isLoading, isError, error, mutate } = useChangeExercise({
    sessionId,
    oldExerciseId: exerciseId,
    workoutId,
  });

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleExerciseSelection = (exerciseId) => {
    // change exercise here:
    mutate(
      { workoutId, newExerciseId: exerciseId },
      {
        onSuccess: (data) => {
          setIsOpen(false);
          router.push(`/sessions/${sessionId}/exercises/${data.exerciseId}`);
        },
      }
    );
  };

  return (
    <>
      <button className="py-4" onClick={() => setIsOpen(true)}>
        <CgSelect className="w-10 h-5" />
      </button>

      <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="sticky top-0 bg-white z-50">
          <div className="flex justify-start">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white mt-2 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
            >
              {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-0 right-0 p-3"
          >
            <BiX className="h-6 w-6" />
          </button>

          <div className="pt-2 w-full">
            {isFilterOpen && (
              <FilterExercises
                setSortBy={setSortBy}
                setCategory={setCategory}
                setView={setView}
                setProfile={setProfile}
              />
            )}
          </div>
          <Input
            onChange={handleQuery}
            value={query}
            label="search"
            isRequired
            type="search"
          />
          <div className="pb-2 w-full">
            <CreateExercise />
          </div>
        </div>
        <SelectableExerciseList
          query={query}
          category={category}
          view={view}
          profile={profile}
          sortBy={sortBy}
          exercises={exercises}
          handleExerciseSelection={handleExerciseSelection}
        />
      </FullPageModal>
    </>
  );
};
