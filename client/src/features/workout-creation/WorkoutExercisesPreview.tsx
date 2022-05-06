import { useExerciseIdsQuery } from 'features/exercises/api/useExerciseIdsQuery';
import React, { useState } from 'react';
import { EditWorkoutExerciseMetadataPreview } from 'features/workout-creation/EditWorkoutExerciseMetadataPreview';
import { RemoveWorkoutExerciseFromPreview } from './RemoveWorkoutExerciseFromPreview';
import { OrderWorkoutExercisePreview } from './OrderWorkoutExercisePreview';

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
          const aIndex = exercises.find((ex) => ex.id === a.exercise_id);
          const bIndex = exercises.find((ex) => ex.id === b.exercise_id);
          return aIndex.order - bIndex.order;
        })
        .map((exercise, key) => (
          <ExercisePreviewRow
            key={exercise.exercise_id}
            order={key}
            exercise={exercise}
            exercises={exercises}
            setExercises={setExercises}
          />
        ))}
    </ul>
  );
};

const ExercisePreviewRow = ({ order, exercises, setExercises, exercise }) => {
  const [isOrdering, setIsOrdering] = useState(false);
  return (
    <li className="flex items-center justify-between py-1">
      <div className="flex items-center">
        <button
          className="p-2 bg-blue-500 text-white rounded-sm"
          type="button"
          onClick={() => setIsOrdering(!isOrdering)}
        >
          {order + 1}
        </button>
        <div>
          <p className="capitalize pl-2">{exercise.name}</p>
          <div
            style={{
              fontSize: '0.5rem',
              paddingTop: '0.2rem',
            }}
            className="uppercase pl-2 flex space-x-3"
          >
            <p>
              sets:
              {exercises.filter((ex) => ex.id === exercise.exercise_id)[0].sets}
            </p>
            <p>
              reps:
              {
                exercises.filter((ex) => ex.id === exercise.exercise_id)[0]
                  .repetitions
              }
            </p>
            <p>
              rir:
              {
                exercises.filter((ex) => ex.id === exercise.exercise_id)[0]
                  .repsInReserve
              }
            </p>
            <p>
              rest:
              {
                exercises.filter((ex) => ex.id === exercise.exercise_id)[0]
                  .restPeriod
              }
            </p>
          </div>
        </div>
      </div>
      <div className="flex">
        {isOrdering ? (
          <>
            <OrderWorkoutExercisePreview
              exercises={exercises}
              setExercises={setExercises}
              exercise={exercise}
            />
          </>
        ) : (
          <>
            <EditWorkoutExerciseMetadataPreview
              exercises={exercises}
              setExercises={setExercises}
              exerciseId={exercise.exercise_id}
            />
            <RemoveWorkoutExerciseFromPreview
              exercises={exercises}
              setExercises={setExercises}
              exercise={exercise}
            />
          </>
        )}
      </div>
    </li>
  );
};
