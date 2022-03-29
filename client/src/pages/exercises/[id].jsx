import React from 'react';
import { GetSingleExercise } from 'features/exercises/GetSingleExercise';

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
    <div>
      ExercisePage
      <GetSingleExercise id={exerciseId} />
    </div>
  );
};

export default ExercisePage;
