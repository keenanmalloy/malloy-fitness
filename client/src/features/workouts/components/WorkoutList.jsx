import React from 'react';
import Link from 'next/link';
import Overview from 'features/workout-overview/Overview';
import { Schedule } from 'features/Schedule';
import { WorkoutHeader } from './WorkoutHeader';

export const WorkoutList = ({ workouts }) => {
  return (
    <ul className="flex flex-col divide-y-2 divide-gray-100">
      {workouts
        .sort((a, b) => b.workout_id - a.workout_id)
        .map((workout) => (
          <li className="border-solid py-6" key={workout.workout_id}>
            <WorkoutHeader
              hasEnded={!!workout.ended_at}
              hasStarted={!!workout.started_at}
              scheduledAt={workout.workout_dt}
            />

            <Link href={`/workouts/${workout.workout_id}`}>
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
            </Link>

            <footer className="flex pt-2 justify-between justify-self-stretch place-content-stretch justify-items-stretch">
              <Schedule workoutId={workout.workout_id} />
              <Overview workout={workout} workoutId={workout.workout_id} />
            </footer>
          </li>
        ))}
    </ul>
  );
};
