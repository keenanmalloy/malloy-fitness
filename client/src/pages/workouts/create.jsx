import React from 'react'
import { CreateWorkout } from '../../components/CreateWorkout';

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:4000/exercises`);
  const data = await res.json();

  return { props: { data } };
}

const ExerciseCreatePage = (props) => {
  const exercises = props.data.exercises

  return (
    <div>
        ExerciseCreatePages
        <CreateWorkout exercises={exercises} />
        </div>
  )
}

export default ExerciseCreatePage