import React from 'react';
import { CreateExercise } from '../../components/CreateExercise';

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:4000/muscle-groups`);
  const data = await res.json();

  return { props: { data } };
}

export default function ExerciseCreatePage(props) {
  const muscleGroups = props.data.muscleGroups
  return (
    <div>
      ExerciseCreatePages
      <CreateExercise  muscleGroups={muscleGroups}/>
    </div>
  );
}
