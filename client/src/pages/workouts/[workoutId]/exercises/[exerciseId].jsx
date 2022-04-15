import React from 'react';
import { useWorkoutExerciseQuery } from 'features/workout-exercises/api/useWorkoutExerciseQuery';
import { WorkoutExercise } from 'features/workout-exercises/components/WorkoutExercise';
import WorkoutExerciseHeader from 'features/workout-header/WorkoutExerciseHeader';

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

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
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
