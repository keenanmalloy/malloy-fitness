import { RemoveExerciseFromWorkout } from 'features/exercises/RemoveExerciseFromWorkout';
import React from 'react';
import WorkoutOrder from './WorkoutOrder';
import WorkoutPriority from './WorkoutPriority';

const WorkoutExercises = ({ exercises, workoutId }) => {
  if (!exercises) {
    return <div>No exercises in workout</div>;
  }

  return (
    <div>
      {exercises
        .sort((a, b) => {
          return a.order - b.order;
        })
        .map((ex) => {
          return (
            <div key={ex.exercise_id}>
              {`${ex.exercise_id}  ${ex.name}`}
              <WorkoutOrder workoutId={workoutId} exercise={ex} />
              <WorkoutPriority workoutId={workoutId} exercise={ex} />
              <RemoveExerciseFromWorkout
                workoutId={workoutId}
                exerciseId={ex.exercise_id}
              />
            </div>
          );
        })}
    </div>
  );
};

export default WorkoutExercises;
