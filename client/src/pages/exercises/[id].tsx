import React from 'react';
import { GetSingleExercise } from 'features/exercises/components/GetSingleExercise';
import Layout from 'features/common/Layout';
import { GetStaticPropsContext } from 'next';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const exerciseId = params && params.id;

  return {
    props: { exerciseId },
  };
}
interface Props {
  exerciseId: string;
}
const ExercisePage = ({ exerciseId }: Props) => {
  return (
    <Layout>
      <h1 className="text-2xl p-5">Exercise</h1>
      <GetSingleExercise id={exerciseId} />
    </Layout>
  );
};

export default ExercisePage;