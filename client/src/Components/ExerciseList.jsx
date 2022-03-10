import React from 'react';
import { Link } from 'react-router-dom';
import { CreateExercise } from './CreateExercise';
import { DeleteExercise } from './DeleteExercise';

export const ExerciseList = ({ exercises, setExercises }) => {
  const deleteExercise = async (id) => {
    const response = await fetch(`http://localhost:4000/exercises/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      return res.json();
    });
    const filteredEx = exercises.filter((exercise) => {
      return exercise.exercise_id !== id;
    });

    setExercises(filteredEx);
  };
  


  if (!exercises.length) {
    return <p>No exercises found</p>;
  }
  return (
    <div>
      {exercises.map((exercise) => (
        <div className="flex flex-col text-center hover:bg-slate-200" key={exercise.exercise_id}>
          <hr />
          <Link to={exercise.exercise_id}>
          <h2 className="text-3xl font-bold">{exercise.name}</h2>
          <p>{exercise.category}</p>
          <p>{exercise.description}</p>
          <p>{exercise.movement}</p>
          <p>{exercise.range}</p>
          <p>{exercise.exercise_id}</p>
          {/* <p>{exercise.primary}</p> */}

          <div className="flex flex-shrink-0">
            <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2" >
              <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                Type
              </div>
              <div className="bg-blue-500 text-green-100 px-2 py-1 rounded-r-md">
                Primary
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0">
            <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2">
              <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                Type
              </div>
              <div className="bg-red-400 text-green-100 px-2 py-1 rounded-r-md">
                Secondary
              </div>
            </div>
          </div>
          </Link>
          <DeleteExercise
            handleClick={() => deleteExercise(exercise.exercise_id)}
          />
        </div>
      ))}
    </div>
  );
};
