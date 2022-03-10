import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExerciseList } from './ExerciseList';

export const GetAllExercises = () => {
  const [exercises, setExercises] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:4000/exercises/')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setExercises(data.exercises);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ExerciseList exercises={exercises} setExercises={setExercises} />
      )}
      <Link to="/exercises/create">
      <button className='text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
        Create exercise
      </button>
      </Link>
    </div>
  );
};
