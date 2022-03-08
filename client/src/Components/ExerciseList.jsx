import React from 'react';
import { DeleteExercise } from './DeleteExercise';

export const ExerciseList = ({data, setData}) => {
  return (
    <div>
       {data.exercises &&
        data.exercises.map((exercise) => (
          <div className="exercise-list" key={exercise.exercise_id}>
            <hr />
            {<h2 className='text-3xl font-bold'>{exercise.name}</h2>}
            <DeleteExercise id={exercise.exercise_id} data={data.exercises} setData={setData}/>
          </div>
        ))}
    </div>
  );
};
