import React from 'react';
import AddExerciseToWorkout from 'features/workout-exercises/components/AddExerciseToWorkout';
import { DeleteWorkout } from 'features/workouts/components/DeleteWorkout';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { UpdateWorkout } from 'features/workouts/components/UpdateWorkout';
import WorkoutExercises from 'features/workout-exercises/components/WorkoutExercises';
import { Skeleton } from 'features/common/Skeleton';
import Link from 'next/link';
import { WorkoutHeader } from './WorkoutHeader';
import { Schedule } from 'features/Schedule';
import { CloneWorkout } from './CloneWorkout';

export const GetSingleWorkout = ({ workoutId }) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-32 rounded-sm" />
          <Skeleton className="h-8 w-10 rounded-sm" />
        </div>

        <Skeleton className="h-44 w-full mt-5" />
        <Skeleton className="h-5 w-full mt-5" />
        <Skeleton className="h-3 w-full mt-2" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5">
        <p style={{ color: 'red' }}>fetching error...</p>
      </div>
    );
  }

  if (!data.workout) {
    return (
      <div className="p-5">
        <p>does not exist...</p>
      </div>
    );
  }

  return (
    <section className="p-5 relative flex flex-col justify-between flex-1">
      <CloneWorkout
        workoutId={workoutId}
        hasSessions={data.workout.hasSessions}
      />
      <WorkoutHeader
        hasEnded={!!data.workout.ended_at}
        hasStarted={!!data.workout.started_at}
        scheduledAt={data.workout.workout_dt}
      />
      <header className="flex justify-between">
        <Link href={`/workouts/`}>
          <button className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32 max-h-9">
            Back
          </button>
        </Link>
        <div className="flex">
          <UpdateWorkout workout={data.workout} />
          <div className="w-1" />
          <DeleteWorkout workoutId={data.workout.workout_id} />
          <div className="w-1" />
          <AddExerciseToWorkout workout={data.workout} />
        </div>
      </header>

      <main className="pt-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl">{data.workout.name}</h1>
            <p className="text-xs">{data.workout.description}</p>
          </div>

          <span className="bg-blue-300 flex items-center text-white px-4 rounded-md max-h-7 h-7">
            {data.workout.category}
          </span>
        </div>

        <WorkoutExercises
          workoutId={data.workout.workout_id}
          exercises={data.workout.exercises}
        />
      </main>

      <footer
        className="
              flex 
              pt-2
              fixed
              bottom-16
            bg-white
              w-full
              right-0
              left-0
              p-5
              justify-center
            "
      >
        <Schedule workoutId={data.workout.workout_id} />
      </footer>
    </section>
  );
};
