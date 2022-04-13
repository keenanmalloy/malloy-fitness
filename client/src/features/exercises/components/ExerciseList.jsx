import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';
import { UpdateExercise } from 'features/exercises/components/UpdateExercise';

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
              {exercise.primary.map((mg) => {
                return <p key={mg.muscle_group_id}>{mg.name}</p>;
              })}
              {exercise.secondary.map((mg) => {
                return <p key={mg.muscle_group_id}>{mg.name}</p>;
              })}
            </div>
          </Link>
          {exercise.view === 'private' && (
            <UpdateExercise exercise={exercise} queryKey="fetchExercises" />
          )}
        </div>
      ))}
    </div>
  );
};
