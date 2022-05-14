import React from 'react';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';
import { useDebounce } from 'features/common/useDebounce';
import { LocalExercise } from './CreateWorkout';
import { Skeleton } from 'features/common/Skeleton';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  query: string;
  exercises: LocalExercise[];
  setExercises: (exercises: LocalExercise[]) => void;
  superset: string | null;
}

export const ChooseWorkoutExerciseList = ({
  query,
  exercises,
  setExercises,
  superset,
}: Props) => {
  const debouncedSearchQuery = useDebounce(query, 600);
  const { data, isError, isLoading } = useExercisesQuery({
    query: debouncedSearchQuery,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    );
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data || !data.exercises.length) {
    return <p>Could not find an exercise with {query}...</p>;
  }

  return (
    <section className="pb-20">
      {data.exercises.map((exercise) => {
        return (
          <article
            className="flex flex-col py-2 relative "
            key={exercise.exercise_id}
          >
            <input
              type="checkbox"
              className="absolute top-0 opacity-0 right-0 w-full h-full peer"
              onChange={(e) => {
                // @ts-ignore
                setExercises((prev: LocalExercise[]) => {
                  if (e.target.checked) {
                    return [
                      ...prev,
                      {
                        id: exercise.exercise_id,
                        superset: superset,
                        sets: null,
                        repetitions: null,
                        repsInReserve: null,
                        restPeriod: null,
                      },
                    ];
                  } else {
                    const removeableOrder = prev.filter(
                      (ex) => ex.id === exercise.exercise_id
                    )[0].order;

                    const updatedOrders = prev.map((d) => {
                      return {
                        ...d,
                        order:
                          removeableOrder < d.order ? d.order - 1 : d.order,
                      };
                    });

                    return updatedOrders.filter(
                      (ex) => ex.id !== exercise.exercise_id
                    );
                  }
                });
              }}
              value={exercise.exercise_id}
              checked={exercises.some((ex) => ex.id === exercise.exercise_id)}
            />
            <div className="px-2 py-2 rounded-md ">
              <h2 className="text-md font-bold">{exercise.name}</h2>
            </div>

            <span
              className={`hidden peer-checked:flex absolute right-2 top-4 
        ${
          exercises.find((ex) => ex.id == exercise.exercise_id)?.superset
            ? `bg-green-500`
            : 'bg-blue-500'
        }
        
        rounded-full text-white w-5 h-5  justify-center items-center`}
            >
              {exercises.findIndex((ex) => ex.id === exercise.exercise_id) + 1}
            </span>
          </article>
        );
      })}
    </section>
  );
};
