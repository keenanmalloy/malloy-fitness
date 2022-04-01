import React from 'react';
import { GetSingleWorkout } from 'features/workouts/GetSingleWorkout';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const workoutId = params && params.id;

  return {
    props: { workoutId },
  };
}
const WorkoutPage = ({ workoutId }) => {
  return (
    <div>
      WorkoutPage
      <GetSingleWorkout workoutId={workoutId} />
    </div>
  );
};

export default WorkoutPage;
