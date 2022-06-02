import React from 'react';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';
import { Skeleton } from 'features/common/Skeleton';
import Image from 'next/image';
import { useDebounce } from 'features/common/useDebounce';
import { CgSpinner } from 'react-icons/cg';
import { BiX } from 'react-icons/bi';

interface Props {
  query: string;
  category: string;
  view: string;
  profile: string;
  sortBy: string;
  isLoading?: boolean;
  exerciseIds: string[];
  handleExerciseSelection: (exerciseId: string) => void;
  selectedExercises?: string[];
  setSelectedExercises?: (exerciseId: string[]) => void;
  handleExerciseSubmission?: () => void;
}

export const SelectableExerciseList = ({
  query,
  category,
  view,
  profile,
  sortBy,
  exerciseIds,
  isLoading,
  handleExerciseSelection,
  selectedExercises,
  setSelectedExercises,
  handleExerciseSubmission,
}: Props) => {
  const debouncedSearchQuery = useDebounce(query, 600);
  const {
    data,
    isError,
    isLoading: isExercisesLoading,
  } = useExercisesQuery({
    query: debouncedSearchQuery,
    category,
    view,
    profile,
    sortBy,
  });
  if (isExercisesLoading) {
    return (
      <section>
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
        <Skeleton className="h-28 w-full mt-2" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="relative p-5">
        {/* <SearchMuscleGroups query={query} setQuery={setQuery} /> */}
        <ul className="flex flex-col divide-y-2 divide-gray-100">
          {/* @@TODO add error alert component here */}
          <p style={{ color: 'red' }}>fetching error...</p>{' '}
        </ul>
      </section>
    );
  }

  if (!data || (data && !data.exercises)) {
    return (
      <section className="relative p-5">
        {/* <SearchMuscleGroups query={query} setQuery={setQuery} /> */}
        <ul className="flex flex-col divide-y-2 divide-gray-100">
          {/* @@TODO add success alert component here */}
          <p>no exercises fetched</p>{' '}
        </ul>
      </section>
    );
  }

  const filteredExercises = data.exercises.filter((exercise) => {
    if (exerciseIds.some((id) => id === exercise.exercise_id)) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CgSpinner size={30} className=" animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y-2 divide-slate-700 text-white">
      {filteredExercises.map((exercise) => (
        <button
          className="border-solid py-6 relative"
          key={exercise.exercise_id}
          onClick={() => handleExerciseSelection(exercise.exercise_id)}
          disabled={isLoading}
        >
          {!!exercise.video && (
            <div className={`mb-5 w-full aspect-video relative`}>
              <Image
                src={`https://thumbnails.trckd.ca/${exercise.video}-0.jpg`}
                layout="fill"
                className="-z-10"
              />
            </div>
          )}

          <div className="flex justify-between text-left">
            <h3
              className={`text-lg ${
                selectedExercises &&
                selectedExercises.includes(exercise.exercise_id) &&
                'text-green-200'
              }`}
            >
              {exercise.name}
            </h3>
            <span
              className={`${
                selectedExercises &&
                selectedExercises.includes(exercise.exercise_id)
                  ? 'bg-green-200 text-slate-900'
                  : 'bg-blue-300 text-white'
              } flex items-center  px-4 rounded-md max-h-7`}
            >
              {exercise.category || 'other'}
            </span>
          </div>
          <p className="text-xs text-left">{exercise.description}</p>

          {/* SVG checkmark icon top right */}
          {!!exercise.video &&
            selectedExercises &&
            selectedExercises.includes(exercise.exercise_id) && (
              <div className="p-3 absolute top-8 right-3 rounded-full shadow-sm bg-green-200 backdrop-blur-sm">
                <svg
                  className="text-slate-900"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
        </button>
      ))}

      {selectedExercises && !!selectedExercises.length && (
        <div className="sticky bottom-5 right-0 left-0 flex ring-green-300 ring-1 rounded-md">
          <button
            className="p-2 bg-slate-800 rounded-l-md"
            onClick={() => setSelectedExercises && setSelectedExercises([])}
          >
            <BiX size={24} />
          </button>
          <button
            className=" bg-slate-700 py-2 w-full z-50 rounded-r-md focus:ring-2 focus:ring-green-200  text-white text-lg"
            onClick={handleExerciseSubmission}
            disabled={isLoading}
          >
            {isLoading ? (
              <CgSpinner size={30} className=" animate-spin text-green-500" />
            ) : (
              ` Add ${selectedExercises.length > 1 ? 'Superset' : 'Exercise'} (
            ${selectedExercises.length})`
            )}
          </button>
        </div>
      )}
    </ul>
  );
};
