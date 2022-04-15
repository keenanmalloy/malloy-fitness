import React from 'react';
import { GetSingleWorkout } from 'features/workouts/components/GetSingleWorkout';
import Layout from 'features/common/Layout';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const workoutId = params && params.workoutId;

  return {
    props: { workoutId },
  };
}
const WorkoutPage = ({ workoutId }) => {
  return (
    <Layout>
      <h1 className="text-2xl p-5">Workout</h1>
      <GetSingleWorkout workoutId={workoutId} />
    </Layout>
  );
};

export default WorkoutPage;
