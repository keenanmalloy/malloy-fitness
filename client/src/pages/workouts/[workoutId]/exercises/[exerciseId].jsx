import React from 'react';
import { useWorkoutExerciseQuery } from 'features/workout-exercises/api/useWorkoutExerciseQuery';
import { WorkoutExercise } from 'features/workout-exercises/components/WorkoutExercise';
import WorkoutExerciseHeader from 'features/workout-header/WorkoutExerciseHeader';
import { Skeleton } from 'features/common/Skeleton';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const exerciseId = params && params.exerciseId;
  const workoutId = params && params.workoutId;

  return {
    props: { exerciseId, workoutId },
  };
}

const WorkoutExercisePage = ({ exerciseId, workoutId }) => {
  const { data, isError, isLoading } = useWorkoutExerciseQuery(
    exerciseId,
    workoutId
  );

  if (isLoading) {
    return (
      <div className="py-5">
        <Skeleton className="h-20 w-full mt-7" />
        <Skeleton className="h-44 w-full mt-1" />
        <Skeleton className="h-28 w-full mt-10" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24 mt-8 mr-4 rounded-md" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-full mt-8 mx-4 rounded-md" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <>
      <WorkoutExerciseHeader workoutId={workoutId} />
      <WorkoutExercise
        exercise={data.exercise}
        prevEx={data.prev}
        nextEx={data.next}
        workoutId={workoutId}
        exerciseId={exerciseId}
      />
    </>
  );
};

export default WorkoutExercisePage;
