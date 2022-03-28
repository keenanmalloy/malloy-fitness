import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AddExerciseToWorkout from 'features/exercises/AddExerciseToWorkout';
import WorkoutExercises from './WorkoutExercises';
import { DeleteWorkout } from './DeleteWorkout';
import { RemoveExerciseFromWorkout } from 'features/exercises/RemoveExerciseFromWorkout';

export const GetSingleWorkout = () => {
  const [singleWorkout, setSingleWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) return;
    fetch(`http://localhost:4000/workouts/${id}`, { credentials: 'include' })
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

  if (error) {
    return <div>No workout available with id: {id}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>{singleWorkout.name}</h1>
        <p>{singleWorkout.workout_id}</p>
        <WorkoutExercises
          workoutId={singleWorkout.workout_id}
          exercises={singleWorkout.exercises}
        />
        {/* 

          If the call is successful, we'll need a way to "refetch" the workout or update the state of exercises.
          We can do this 2 ways.

          1. Refetch the workout in the useEffect hook. *ideal solution*

          - Perhaps we can think about bringing in "react-query" to handle this logic for us. 
          If you want to handle it yourself you can try to add state to the <GetSingleWorkout /> component and pass the state to <WorkoutExercises /> 
          so that whenever a fetch is successful, we can call a rerender of the component. Up to you. 

          2. Handle this in state *not ideal*

          - Putting the list of exercises in state and manually updating that state by filtering out the exericise being changed, and replacing it with the 
          exercise that has the updated order / priority. 

        */}
      </div>
      <DeleteWorkout workoutId={singleWorkout.workout_id} />
      <AddExerciseToWorkout data={singleWorkout} />
      <RemoveExerciseFromWorkout />
    </div>
  );
};
