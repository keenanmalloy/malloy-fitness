import React from 'react';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';
import { Skeleton } from 'features/common/Skeleton';
import Image from 'next/image';
import { useDebounce } from 'features/common/useDebounce';

export const SelectableExerciseList = ({
  query,
  category,
  view,
  profile,
  sortBy,
  exercises,
  handleExerciseSelection,
}) => {
  const debouncedSearchQuery = useDebounce(query, 600);
  const { data, isError, isLoading } = useExercisesQuery({
    query: debouncedSearchQuery,
    category,
    view,
    profile,
    sortBy,
  });
  if (isLoading) {
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

  if (!data.exercises) {
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
    if (exercises.find((e) => e.exercise_id === exercise.exercise_id)) {
      return false;
    }
    return true;
  });

  return (
    <ul className="flex flex-col divide-y-2 divide-gray-100">
      {filteredExercises.map((exercise) => (
        <button
          className="border-solid py-6"
          key={exercise.exercise_id}
          onClick={() => handleExerciseSelection(exercise.exercise_id)}
        >
          {!!exercise.video && (
            <div className="mb-5 w-full aspect-video relative">
              <Image
                src={`https://thumbnails.trckd.ca/${exercise.video}-0.jpg`}
                layout="fill"
                className="-z-10"
              />
            </div>
          )}

          <div className="flex justify-between">
            <h3 className="text-lg">{exercise.name}</h3>
            <span className="bg-blue-300 flex items-center text-white px-4 rounded-md max-h-7">
              {exercise.category || 'other'}
            </span>
          </div>
          <p className="text-xs">{exercise.description}</p>
        </button>
      ))}
    </ul>
  );
};
