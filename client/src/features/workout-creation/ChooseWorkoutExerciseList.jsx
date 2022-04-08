import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';

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

export const ChooseWorkoutExerciseList = ({
  query,
  exercises,
  setExercises,
}) => {
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
    <div className="p-1">
      {data.exercises.map((exercise) => (
        <article
          className="flex flex-col py-2 relative "
          key={exercise.exercise_id}
        >
          <input
            type="checkbox"
            className="absolute top-0 opacity-0 right-0 w-full h-full peer"
            onChange={(e) => {
              setExercises((prev) => {
                if (e.target.checked) {
                  return [
                    ...prev,
                    {
                      id: exercise.exercise_id,
                      sets: null,
                      repetitions: null,
                      repsInReserve: null,
                      restPeriod: null,
                    },
                  ];
                } else {
                  return prev.filter((ex) => ex.id !== exercise.exercise_id);
                }
              });
            }}
            value={exercise.exercise_id}
            checked={exercises.some((ex) => ex.id === exercise.exercise_id)}
          />
          <div className="px-3 py-3 rounded-md peer-checked:ring-blue-500 peer-checked:ring-2 peer-checked:bg-white">
            <h2 className="text-xl font-bold">{exercise.name}</h2>
            <p>Category: {exercise.category}</p>
            <p>Description: {exercise.description}</p>
            <p>Movement: {exercise.movement}</p>
            <p>Range: {exercise.range}</p>
          </div>

          <span className="hidden peer-checked:flex absolute right-2 top-4 bg-blue-500 rounded-full text-white w-5 h-5  justify-center items-center">
            {exercises.findIndex((ex) => ex.id === exercise.exercise_id) + 1}
          </span>
        </article>
      ))}
    </div>
  );
};
