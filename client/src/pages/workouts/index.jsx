import React from 'react';
import { GetAllWorkouts } from 'features/workouts/components/GetAllWorkouts';
import Layout from 'features/common/Layout';

const WorkoutsPage = () => {
  return (
    <Layout>
      <GetAllWorkouts />
    </Layout>
  );
};

export default WorkoutsPage;
