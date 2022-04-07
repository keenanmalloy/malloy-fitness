import { useExerciseIdsQuery } from 'features/exercises/useExerciseIdsQuery';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { EditWorkoutExerciseMetadataPreview } from './EditWorkoutExerciseMetadataPreview';

export const WorkoutExercisesPreview = ({ exercises, setExercises }) => {
  const { data, isLoading, isError } = useExerciseIdsQuery(
    exercises.map((ex) => ex.id)
  );

  if (isLoading) {
    return <p className="py-2">Loading...</p>;
  }

  if (isError) {
    return <p className="py-2">Error...</p>;
  }

  if (!data) {
    return <p className="py-2">No exercises selected</p>;
  }

  return (
    <ul className="divide-y-2 divide-solid divide-gray-200 py-2">
      {data.exercises
        .sort((a, b) => {
          const aIndex = exercises.findIndex((ex) => ex.id === a.exercise_id);
          const bIndex = exercises.findIndex((ex) => ex.id === b.exercise_id);
          return aIndex - bIndex;
        })
        .map((exercise, key) => (
          <li
            key={exercise.exercise_id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className="p-2 bg-blue-500 text-white rounded-sm">
                {key + 1}
              </span>
              <div>
                <p className="capitalize pl-2">{exercise.name}</p>
                <div className="uppercase pl-2 text-xs flex space-x-3">
                  <p>
                    sets:
                    {
                      exercises.filter(
                        (ex) => ex.id === exercise.exercise_id
                      )[0].sets
                    }
                  </p>
                  <p>
                    reps:
                    {
                      exercises.filter(
                        (ex) => ex.id === exercise.exercise_id
                      )[0].repetitions
                    }
                  </p>
                  <p>
                    rir:
                    {
                      exercises.filter(
                        (ex) => ex.id === exercise.exercise_id
                      )[0].repsInReserve
                    }
                  </p>
                  <p>
                    rest:
                    {
                      exercises.filter(
                        (ex) => ex.id === exercise.exercise_id
                      )[0].restPeriod
                    }
                  </p>
                </div>
              </div>
            </div>
            <div>
              <EditWorkoutExerciseMetadataPreview
                exercises={exercises}
                setExercises={setExercises}
                exerciseId={exercise.exercise_id}
              />
              <button
                className="ml-2"
                type="button"
                onClick={() => {
                  setExercises((prev) =>
                    prev.filter((ex) => ex.id !== exercise.exercise_id)
                  );
                }}
              >
                <IoMdClose />
              </button>
            </div>
          </li>
        ))}
    </ul>
  );
};
