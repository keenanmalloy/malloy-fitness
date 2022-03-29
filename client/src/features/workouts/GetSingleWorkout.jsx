import React from 'react';
import AddExerciseToWorkout from 'features/exercises/AddExerciseToWorkout';
import WorkoutExercises from './WorkoutExercises';
import { DeleteWorkout } from './DeleteWorkout';
import { useWorkoutQuery } from './useWorkoutQuery';

export const GetSingleWorkout = ({ workoutId }) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (data && !data.workout) {
    return <p>none available...</p>;
  }
  return (
    <div>
      <div>
        <h1>{data.workout.name}</h1>
        <p>{data.workout.workout_id}</p>
        <WorkoutExercises
          workoutId={data.workout.workout_id}
          exercises={data.workout.exercises}
        />
        {/* 

          If the call is successful, we'll need a way to "refetch" the workout or update the state of exercises.
          We can do this 2 ways.

          1. Refetch the workout in the useEffect hook. *ideal solution*

          - Perhaps we can think about bringing in "react-query" to handle this logic for us. 
          If you want to handle it yourself you can try to add state to the <Getdata.workout /> component and pass the state to <WorkoutExercises /> 
          so that whenever a fetch is successful, we can call a rerender of the component. Up to you. 

          2. Handle this in state *not ideal*

          - Putting the list of exercises in state and manually updating that state by filtering out the exericise being changed, and replacing it with the 
          exercise that has the updated order / priority. 

        */}
      </div>
      <DeleteWorkout workoutId={data.workout.workout_id} />
      <AddExerciseToWorkout workout={data.workout} />
    </div>
  );
};
