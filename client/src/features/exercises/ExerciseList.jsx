import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExercisesQuery } from './useExercisesQuery';
import { Button } from 'features/common/Button';
import { UpdateExercise } from './UpdateExercise';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const ExerciseList = ({ query }) => {
  const debouncedSearchQuery = useDebounce(query, 600);
  const { data, isError, isLoading } = useExercisesQuery(debouncedSearchQuery);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.exercises) {
    return <p>none available...</p>;
  }

  console.log({ data });

  return (
    <div>
      {data.exercises.map((exercise) => (
        <div
          className="flex flex-col text-center hover:bg-slate-200"
          key={exercise.exercise_id}
        >
          <hr />
          <Link href={`/exercises/${exercise.exercise_id}`}>
            <div>
              <h2 className="text-3xl font-bold">{exercise.name}</h2>
              <p>{exercise.category}</p>
              <p>{exercise.description}</p>
              <p>{exercise.movement}</p>
              <p>{exercise.range}</p>
              <p>{exercise.exercise_id}</p>

              <div className="flex flex-shrink-0">
                <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2">
                  <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                    Type
                  </div>
                  <div className="bg-blue-500 text-green-100 px-2 py-1 rounded-r-md">
                    Primary
                  </div>
                </div>
              </div>
              <div className="flex flex-shrink-0">
                <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2">
                  <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                    Type
                  </div>
                  <div className="bg-red-400 text-green-100 px-2 py-1 rounded-r-md">
                    Secondary
                  </div>
                </div>
              </div>
            </div>
          </Link>
          {exercise.view === 'private' && (
            <UpdateExercise exercise={exercise} />
          )}
        </div>
      ))}
    </div>
  );
};
