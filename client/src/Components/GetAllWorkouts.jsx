import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExerciseList } from './ExerciseList';
import Button from './Button';

export const GetAllWorkouts = () => {
  const [workouts, setWorkouts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:4000/workouts/')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setWorkouts(data.workouts);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {/* {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ExerciseList exercises={exercises} setExercises={setExercises} />
      )} */}
    <p>All workouts</p>
      <Button href="/workouts/create">Create workout</Button>
    </div>
  );
};