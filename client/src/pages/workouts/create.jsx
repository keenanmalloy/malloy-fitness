import React from 'react';
import { CreateWorkout } from 'features/workout-creation/CreateWorkout';
import Layout from 'features/common/Layout';

const CreateWorkoutPage = () => {
  return (
    <Layout>
      <CreateWorkout />
    </Layout>
  );
};

export default CreateWorkoutPage;
