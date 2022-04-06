import React from 'react';
import { GetAllExercises } from 'features/exercises/GetAllExercises';
import Layout from 'features/common/Layout';

const ExercisesPage = () => {
  return (
    <Layout>
      <GetAllExercises />
    </Layout>
  );
};

export default ExercisesPage;
