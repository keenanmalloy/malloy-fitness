import React from 'react';
import { GetSingleWorkout } from 'features/workouts/GetSingleWorkout';
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
      WorkoutPage
      <GetSingleWorkout workoutId={workoutId} />
    </Layout>
  );
};

export default WorkoutPage;
