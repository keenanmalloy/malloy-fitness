import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExerciseList } from './ExerciseList';
import { Button } from  './Button';

export const GetAllExercises = () => {
  const [exercises, setExercises] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/exercises/')
      .then((res) => {
        if(!res.ok) {
          throw Error('couldnt fetch all exercises')
        }
        return res.json();
      })
      .then((data) => {
        setExercises(data.exercises);
        setIsLoading(false);
      }).catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ExerciseList exercises={exercises} setExercises={setExercises} />
      )}

      <Button href="/exercises/create">Create exercise</Button>
    </div>
  );
};
