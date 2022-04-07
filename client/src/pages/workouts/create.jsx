<<<<<<< HEAD
import React, { useState } from 'react';
import { CreateWorkout } from 'features/workouts/CreateWorkout';
import { useExercisesQuery } from 'features/exercises/useExercisesQuery';
import { Input } from 'features/form/Input';
import { GetAllExercises } from 'features/exercises/GetAllExercises';
import { ExerciseList } from 'features/exercises/ExerciseList';
import { Button } from 'features/common/Button';
=======
import React from 'react';
import { CreateWorkout } from 'features/workouts/CreateWorkout';
import Layout from 'features/common/Layout';

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:4000/exercises`);
  const data = await res.json();

  return { props: { data } };
}

const ExerciseCreatePage = (props) => {
  const exercises = props.data.exercises;
>>>>>>> f70daa5768a0ea052642b2b0044dd08b5dd578b9

const CreateWorkoutPage = () => {
  return (
<<<<<<< HEAD
    <div>
      <h1 className="text-3xl p-5">Create Workout</h1>
      <Button href="/workouts">Workouts</Button>
      <Button href="/">Home</Button>
      <CreateWorkout />
    </div>
=======
    <Layout>
      ExerciseCreatePages
      <CreateWorkout exercises={exercises} />
    </Layout>
>>>>>>> f70daa5768a0ea052642b2b0044dd08b5dd578b9
  );
};

export default CreateWorkoutPage;
