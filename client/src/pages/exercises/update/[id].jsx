import { UpdateExercise } from 'features/exercises/UpdateExercise';
import React from 'react';

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:4000/muscle-groups`);
  const data = await res.json();

  return { props: { data } };
}

export default function UpdateExercisePage(props) {
  const { muscleGroups } = props.data;
  return (
    <div>
      UpdateExercisePage
      <UpdateExercise muscleGroups={muscleGroups} />
    </div>
  );
}
