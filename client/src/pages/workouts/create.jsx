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

  return (
    <Layout>
      ExerciseCreatePages
      <CreateWorkout exercises={exercises} />
    </Layout>
  );
};

export default ExerciseCreatePage;
