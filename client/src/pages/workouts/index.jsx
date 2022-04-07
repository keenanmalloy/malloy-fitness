import React from 'react';
import { GetAllWorkouts } from 'features/workouts/GetAllWorkouts';
import Layout from 'features/common/Layout';

const WorkoutsPage = () => {
  return (
    <Layout>
      WorkoutsPage
      <GetAllWorkouts />
    </Layout>
  );
};

export default WorkoutsPage;
