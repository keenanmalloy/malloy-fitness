import React from 'react';
import { GetSingleExercise } from 'features/exercises/components/GetSingleExercise';
import Layout from 'features/common/Layout';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const exerciseId = params && params.id;

  return {
    props: { exerciseId },
  };
}

const ExercisePage = ({ exerciseId }) => {
  return (
    <Layout>
      ExercisePage
      <GetSingleExercise id={exerciseId} />
    </Layout>
  );
};

export default ExercisePage;
