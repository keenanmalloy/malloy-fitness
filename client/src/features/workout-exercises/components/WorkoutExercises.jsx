import { RemoveExerciseFromWorkout } from 'features/workout-exercises/components/RemoveExerciseFromWorkout';
import React from 'react';
import UpdateWorkoutExerciseMetadata from 'features/workout-exercises/components/UpdateWorkoutExerciseMetadata';
import WorkoutOrder from 'features/workouts/components/WorkoutOrder';
import WorkoutPriority from 'features/workouts/components/WorkoutPriority';

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
              <div className="p-2 ">
                <p>Repititions: {ex.repetitions}</p>
                <p>Sets: {ex.sets}</p>
                <p>RIR: {ex.repsInReserve}</p>
                <p>Rest: {ex.restPeriod}</p>
              </div>
              <WorkoutOrder workoutId={workoutId} exercise={ex} />
              <WorkoutPriority workoutId={workoutId} exercise={ex} />
              <UpdateWorkoutExerciseMetadata
                sets={ex.sets}
                repetitions={ex.repetitions}
                repsInReserve={ex.repsInReserve}
                rest={ex.restPeriod}
                refetchKey={'fetchWorkout'}
                workoutId={workoutId}
                exerciseId={ex.exercise_id}
              />
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
