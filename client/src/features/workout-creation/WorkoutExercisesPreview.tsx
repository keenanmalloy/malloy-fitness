import {
  GetExercisesByIdsSchema,
  useExerciseIdsQuery,
} from 'features/exercises/api/useExerciseIdsQuery';
import { RemoveWorkoutExerciseFromPreview } from './RemoveWorkoutExerciseFromPreview';
import { LocalExercise } from './CreateWorkout';
import { Skeleton } from 'features/common/Skeleton';

interface Props {
  exercises: LocalExercise[];
  setExercises: (exercises: LocalExercise[]) => void;
}

export const WorkoutExercisesPreview = ({ exercises, setExercises }: Props) => {
  const { data, isLoading, isError } = useExerciseIdsQuery(
    exercises.map((ex) => ex.id)
  );

  if (isLoading) {
    return (
      <ul className="py-2">
        <h3>Selected Exercises</h3>
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </ul>
    );
  }

  if (isError) {
    return (
      <ul className="py-2">
        <h3>Selected Exercises</h3>
      </ul>
    );
  }

  if (!data) {
    return (
      <ul className="py-2">
        <h3>Selected Exercises</h3>
      </ul>
    );
  }

  const exerciseOrder = exercises.map((ex) => ex.id);

  return (
    <ul className="py-2">
      <h3>Selected Exercises</h3>
      {data.exercises
        .sort((a, b) =>
          exerciseOrder.indexOf(a.exercise_id) >
          exerciseOrder.indexOf(b.exercise_id)
            ? 1
            : -1
        )
        .map((exercise, key) => {
          // get previous exercise in array
          const previousExercise = key > 0 ? data.exercises[key - 1] : null;
          const previousExerciseSuperset = exercises.find(
            (ex) => ex.id === previousExercise?.exercise_id
          )?.superset;
          const currentExerciseSuperset = exercises.find(
            (ex) => ex.id === exercise?.exercise_id
          )?.superset;

          return (
            <ExercisePreviewRow
              key={exercise.exercise_id}
              order={key}
              exercise={exercise}
              exercises={exercises}
              setExercises={setExercises}
              isInPreviousSuperset={
                !!previousExerciseSuperset &&
                !!currentExerciseSuperset &&
                previousExerciseSuperset === currentExerciseSuperset
              }
            />
          );
        })}
    </ul>
  );
};

interface ExercisePreviewRowProps {
  order: number;
  exercise: GetExercisesByIdsSchema['exercises'][0];
  exercises: LocalExercise[];
  setExercises: (exercises: LocalExercise[]) => void;
  isInPreviousSuperset: boolean;
}

const ExercisePreviewRow = ({
  order,
  exercises,
  setExercises,
  exercise,
  isInPreviousSuperset,
}: ExercisePreviewRowProps) => {
  if (isInPreviousSuperset) {
    return (
      <li className="flex items-center justify-between mb-2">
        <div className="flex items-center w-full">
          <button
            className={` 
            ${
              exercises.find((ex) => ex.id === exercise.exercise_id)?.superset
                ? 'bg-green-500'
                : 'bg-blue-500'
            }
           text-white rounded-sm min-w-10 w-10 h-10
           `}
            type="button"
          >
            <p>{order + 1}</p>
          </button>
          <div className="w-full">
            <p className="capitalize pl-2">{exercise.name}</p>
          </div>
        </div>
        <RemoveWorkoutExerciseFromPreview
          exercises={exercises}
          setExercises={setExercises}
          exercise={exercise}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between py-2 mt-1 border-t-2 border-solid border-gray-100">
      <div className="flex items-center w-full">
        <button
          className={` 
            ${
              exercises.find((ex) => ex.id === exercise.exercise_id)?.superset
                ? 'bg-green-500'
                : 'bg-blue-500'
            }
           text-white rounded-sm min-w-10 w-10 h-10
           `}
          type="button"
        >
          <p>{order + 1}</p>
        </button>
        <div className="w-full">
          <p className="capitalize pl-2">{exercise.name}</p>
        </div>
      </div>

      <RemoveWorkoutExerciseFromPreview
        exercises={exercises}
        setExercises={setExercises}
        exercise={exercise}
      />
    </li>
  );
};
