import React from 'react';
import { CreateExercise } from 'features/exercises/CreateExercise';
import Layout from 'features/common/Layout';

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:4000/muscle-groups`);
  const data = await res.json();

  return { props: { data } };
}

export default function ExerciseCreatePage(props) {
  const { muscleGroups } = props.data;
  return (
    <Layout>
      ExerciseCreatePages
      <CreateExercise muscleGroups={muscleGroups} />
    </Layout>
  );
}
