import { RemoveExerciseFromWorkout } from 'features/workout-exercises/components/RemoveExerciseFromWorkout';
import React from 'react';
import UpdateWorkoutExerciseMetadata from 'features/workout-exercises/components/UpdateWorkoutExerciseMetadata';
import WorkoutOrder from 'features/workouts/components/WorkoutOrder';

const WorkoutExercises = ({ exercises, workoutId }) => {
  if (!exercises) {
    return <div>No exercises in workout</div>;
  }

  return (
    <ul className="pt-5 pb-20 divide-y-2 divide-gray-100">
      {exercises
        .sort((a, b) => {
          return a.order - b.order;
        })
        .map((ex) => {
          return (
            <li key={ex.exercise_id} className="border-solid py-6">
              <div className="flex justify-between">
                <h3 className="text-lg">{ex.name}</h3>
                <span className="pt-3 px-3 text-md">{ex.order}</span>
              </div>

              <h3 className="text-xs">{ex.description}</h3>

              <div className="pt-5 pb-2 flex justify-between">
                <div>
                  <p>Repititions: {ex.repetitions}</p>
                  <p>Sets: {ex.sets}</p>
                  <p>RIR: {ex.repsInReserve}</p>
                  <p>Rest: {ex.restPeriod}</p>
                </div>
                <WorkoutOrder workoutId={workoutId} exercise={ex} />
              </div>

              {/* <WorkoutPriority workoutId={workoutId} exercise={ex} /> */}
              <div className="flex justify-between">
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
            </li>
          );
        })}
    </ul>
  );
};

export default WorkoutExercises;
