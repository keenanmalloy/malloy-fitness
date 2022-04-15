import React from 'react';
import { GetAllWorkouts } from 'features/workouts/components/GetAllWorkouts';
import Layout from 'features/common/Layout';
import { CreateWorkout } from 'features/workout-creation/CreateWorkout';
import { Button } from 'features/common/Button';

const WorkoutsPage = () => {
  return (
    <Layout>
      <section className="p-5">
        <h1 className="pb-10">Workouts</h1>
        <div className="sticky top-10 bg-white">
          <div className="py-2 w-full">
            <Button href="/workouts/create" className="w-full">
              Create workout
            </Button>
          </div>
        </div>
        <GetAllWorkouts />
      </section>
    </Layout>
  );
};

export default WorkoutsPage;
