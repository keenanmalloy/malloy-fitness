import React from 'react';
import { GetSingleWorkout } from 'features/workouts/components/GetSingleWorkout';
import Layout from 'features/common/Layout';
import { GetStaticPropsContext } from 'next';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const workoutId = params && params.workoutId;

  return {
    props: { workoutId },
  };
}

interface Props {
  workoutId: string;
}

const WorkoutPage = ({ workoutId }: Props) => {
  return (
    <Layout>
      <h1 className="text-2xl p-5">Workout</h1>
      <GetSingleWorkout workoutId={workoutId} />
    </Layout>
  );
};

export default WorkoutPage;
