import { RemoveExerciseFromWorkout } from 'features/workout-exercises/components/RemoveExerciseFromWorkout';
import React from 'react';
import UpdateWorkoutExerciseMetadata from 'features/workout-exercises/components/UpdateWorkoutExerciseMetadata';
import WorkoutOrder from 'features/workouts/components/WorkoutOrder';

interface Props {
  workoutId: string;
  exercises: any[];
}

const WorkoutExercises = ({ exercises, workoutId }: Props) => {
  if (!exercises) {
    return <div>No exercises in workout</div>;
  }

  console.log({ exercises: exercises.map((e) => e.exercise_id) });

  return (
    <ul className="pt-5 pb-20 divide-y-2 divide-gray-100">
      {exercises
        .sort((a, b) => {
          return a.order - b.order;
        })
        .map((ex) => {
          return (
            <li key={ex.exercise_id} className="border-solid py-6 flex w-full">
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between">
                      <h3 className="text-lg">{ex.name}</h3>
                      <RemoveExerciseFromWorkout
                        workoutId={workoutId}
                        exerciseId={ex.exercise_id}
                      />
                    </div>

                    <div className="py-4 flex justify-between text-xs w-full max-w-md">
                      <p>Reps: {ex.repetitions}</p>
                      <p>Sets: {ex.sets}</p>
                      <p>RIR: {ex.repsInReserve}</p>
                      <p>Rest: {ex.restPeriod}</p>
                      <p></p>
                    </div>
                  </div>
                </div>

                <UpdateWorkoutExerciseMetadata
                  sets={ex.sets}
                  repetitions={ex.repetitions}
                  repsInReserve={ex.repsInReserve}
                  weight={ex.weight}
                  restPeriod={ex.restPeriod}
                  refetchKey={'fetchWorkout'}
                  workoutId={workoutId}
                  exerciseId={ex.exercise_id}
                />
              </div>
              <div className="pl-5 flex item-center">
                <WorkoutOrder workoutId={workoutId} exercise={ex} />
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default WorkoutExercises;
