import React, { useState, useEffect } from 'react';
import { DeleteExercise } from './DeleteExercise';
import { useRouter } from 'next/router';
import Button  from '../components/Button';

export const GetSingleWorkout = () => {
  const [singleWorkout, setSingleWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const id = router.query.id;

  useEffect(() => {
    fetch(`http://localhost:4000/workouts/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSingleWorkout(data.workout);
        setIsLoading(false);
      });
  }, []);

  const deleteWorkout = async (id) => {
    const response = await fetch(`http://localhost:4000/workouts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      return res.json();
    });

    if (response.status === 'success') {
      setSingleWorkout(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleWorkout) {
    return <div>No workout available with id: {id}</div>;
  }

  return (
    <div>
      <div>
        <p>{singleWorkout.name}</p>
        <p>{singleWorkout.description}</p>
        <p>{singleWorkout.movement}</p>
        <p>{singleWorkout.range}</p>
        <p>{singleWorkout.workout_id}</p>
      </div>

      <DeleteExercise
        handleClick={() => deleteWorkout(singleWorkout.workout_id)}
      />

      <Button href="/">Admin</Button>
    </div>
  );
};
