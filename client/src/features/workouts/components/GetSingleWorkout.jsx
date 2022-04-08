import React from 'react';
import AddExerciseToWorkout from 'features/workout-exercises/components/AddExerciseToWorkout';
import { DeleteWorkout } from 'features/workouts/components/DeleteWorkout';
import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import { UpdateWorkout } from 'features/workouts/components/UpdateWorkout';
import WorkoutExercises from 'features/workout-exercises/components/WorkoutExercises';

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
        <h1>name: {data.workout.name}</h1>
        <p>id: {data.workout.workout_id}</p>
        <p>category: {data.workout.category}</p>
        <p>description: {data.workout.description}</p>
        <WorkoutExercises
          workoutId={data.workout.workout_id}
          exercises={data.workout.exercises}
        />
      </div>
      <UpdateWorkout workout={data.workout} />
      <DeleteWorkout workoutId={data.workout.workout_id} />
      <AddExerciseToWorkout workout={data.workout} />
    </div>
  );
};
