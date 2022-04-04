import React from 'react';
import { useWorkoutExerciseQuery } from 'features/workouts/useWorkoutExerciseQuery';
import { SetsByExercise } from 'features/sets/SetsByExercise';

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

  // We want to drill these as props to a component that fetches the WorkoutExercise.
  // GET /workouts/:pk/exercises/:pk/

  // We want to retrieve all the sets by the exercise in a component called <Sets />
  // GET /workouts/:pk/exercise/:pk/sets/

  // Need to create another component called <Set /> which contains the logic
  // for updating the reps, the weight, & deletion of the set
  // PUT /workouts/:pk/sets/:pk/
  // BODY {
  //   repetitions - optional
  //   weight - optional
  // }

  // Need to create another component called <CreateSet /> which contains the logic
  // for creating a new set
  // POST /workouts/:pk/sets/
  // BODY {
  //   exercise_id - required
  //   repetitions - optional
  //   weight - optional
  // }

  // If there are no sets, default an empty <Set /> components
  // If there are sets already present, prefill them with data via props

  // ---------------------------------------------

  // We need a button(s) at the bottom of the page that show conditionally based on
  // if the user has a previous exercise, next exercise, or is about to finish the workout.
  // You can check the response of the workout exercise for the next.order object or previous.order object
  // to determine these button states.

  return (
    <div>
      Workout Exercise Page
      <p>{data.exercise.name}</p>
      <p>{data.exercise.video}</p>
      {/* <GetSingleWorkout exerciseId={exerciseId} /> */}
      <SetsByExercise workoutId={workoutId} exerciseId={exerciseId} />
    </div>
  );
};

export default WorkoutExercisePage;
