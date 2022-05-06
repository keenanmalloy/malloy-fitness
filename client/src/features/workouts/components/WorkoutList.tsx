import React from 'react';
import { Schedule } from 'features/Schedule';
import { WorkoutHeader } from './WorkoutHeader';
import { Button } from 'features/common/Button';

export const WorkoutList = ({ workouts }) => {
  return (
    <ul className="flex flex-col divide-y-2 divide-gray-100">
      {workouts.map((workout) => (
        <li className="border-solid py-6" key={workout.workout_id}>
          <WorkoutHeader
            hasEnded={!!workout.ended_at}
            hasStarted={!!workout.started_at}
            scheduledAt={workout.workout_dt}
          />

          <main>
            <div className="flex justify-between">
              <div>
                <h1 className="text-xl">{workout.name}</h1>
                <p className="text-xs">{workout.description}</p>
              </div>

              <span className="bg-blue-300 flex items-center text-white px-4 rounded-md max-h-7 h-7">
                {workout.category}
              </span>
            </div>
          </main>

          <footer className="flex pt-2 justify-between justify-self-stretch place-content-stretch justify-items-stretch">
            <Schedule workoutId={workout.workout_id} />
            <Button href={`/workouts/${workout.workout_id}`}>Edit</Button>
          </footer>
        </li>
      ))}
    </ul>
  );
};
