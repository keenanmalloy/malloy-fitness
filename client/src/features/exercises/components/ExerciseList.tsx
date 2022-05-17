import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';
import { UpdateExercise } from 'features/exercises/components/UpdateExercise';
import { Skeleton } from 'features/common/Skeleton';
import { DeleteExercise } from './DeleteExercise';
import Image from 'next/image';
import { useDebounce } from 'features/common/useDebounce';

interface Props {
  query: string;
  category: string;
  view: string;
  profile: string;
  sortBy: string;
}

export const ExerciseList = ({
  query,
  category,
  view,
  profile,
  sortBy,
}: Props) => {
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

  if (!data || !data.exercises) {
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

  return (
    <ul className="flex flex-col divide-y-2 divide-slate-700">
      {data.exercises.map((exercise) => (
        <li className="border-solid py-6" key={exercise.exercise_id}>
          {!!exercise.video && (
            <Link href={`/exercises/${exercise.exercise_id}`}>
              <div className="mb-5 w-full aspect-video relative z-10">
                <Image
                  src={`https://thumbnails.trckd.ca/${exercise.video}-0.jpg`}
                  layout="fill"
                  className="-z-10"
                />
              </div>
            </Link>
          )}

          <div className="flex justify-between">
            <h3 className="text-lg">{exercise.name}</h3>
            <span className="bg-blue-300 flex items-center text-white px-4 rounded-md max-h-7">
              {exercise.category || 'other'}
            </span>
          </div>
          <p className="text-xs">{exercise.description}</p>

          <footer className="flex pt-2 justify-between justify-self-stretch place-content-stretch justify-items-stretch">
            <Link href={`/exercises/${exercise.exercise_id}`}>
              <button className="bg-slate-700 mt-2 text-white font-semibold py-2 px-4 rounded shadow w-32">
                Visit
              </button>
            </Link>
            {(data.role === 'developer' || exercise.view === 'private') && (
              <div className="flex">
                <DeleteExercise exerciseId={exercise.exercise_id} />
                <div className="w-1" />
                <UpdateExercise exercise={exercise} queryKey="fetchExercises" />
              </div>
            )}
          </footer>
        </li>
      ))}
    </ul>
  );
};
