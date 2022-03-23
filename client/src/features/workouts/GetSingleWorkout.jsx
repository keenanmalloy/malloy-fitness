import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from  'features/common/Button';
import AddExerciseToWorkout from 'features/exercises/AddExerciseToWorkout';

export const GetSingleWorkout = () => {
  const [singleWorkout, setSingleWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) return;
    fetch(`http://localhost:4000/workouts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw Error('Couldnt fetch workout');
        }
        return res.json();
      })
      .then((data) => {
        setSingleWorkout(data.workout);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [router.isReady]);

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
        <h1>{singleWorkout.name}</h1>
        <p>{singleWorkout.workout_id}</p>
        {singleWorkout.exercises.map((ex) => {
          return (
            <div key={ex.exercise_id}>{`${ex.exercise_id}  ${ex.name}`}</div>
          );
        })}
      </div>

      <Button handleClick={() => deleteWorkout(singleWorkout.workout_id)}>
        Delete workout
      </Button>
      <AddExerciseToWorkout data={singleWorkout}/>
    </div>
  );
};
