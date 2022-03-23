import React, { useState, useEffect } from 'react';
import { Button } from  'features/common/Button';
import { WorkoutList } from './WorkoutList';

export const GetAllWorkouts = () => {
  const [workouts, setWorkouts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/workouts/')
      .then((res) => {
        if(!res.ok) {
          throw Error('Couldnt fetch all workouts')
        }
        return res.json();
      })
      .then((data) => {
        setWorkouts(data.workouts);
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
        <WorkoutList workouts={workouts} setWorkouts={setWorkouts} />
      )}
      <Button href="/workouts/create">Create workout</Button>
    </div>
  );
};