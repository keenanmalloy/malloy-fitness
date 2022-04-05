import React from 'react';
import Link from 'next/link';
import { DeleteWorkout } from './DeleteWorkout';
import { Button } from 'features/common/Button';
import Overview from 'features/overview/Overview';

export const WorkoutList = ({ workouts }) => {
  if (!workouts.length) {
    return <p>No workouts found</p>;
  }
  return (
    <div>
      {workouts.map((workout) => (
        <div
          className="flex flex-col text-center hover:bg-slate-200"
          key={workout.workout_id}
        >
          <hr />
          <Link href={`/workouts/${workout.workout_id}`}>
            <div>
              <h2 className="text-3xl font-bold">{workout.name}</h2>
              <p>{workout.category}</p>
              <p>{workout.description}</p>
              <p>{workout.workout_id}</p>

              <div className="flex flex-shrink-0">
                <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2">
                  <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                    Type
                  </div>
                  <div className="bg-blue-500 text-green-100 px-2 py-1 rounded-r-md">
                    Primary
                  </div>
                </div>
              </div>
              <div className="flex flex-shrink-0">
                <div className="flex flex-shrink-0 text-sm items-center px-2 mb-2">
                  <div className="bg-gray-400 text-gray-600 px-2 py-1 rounded-l-md">
                    Type
                  </div>
                  <div className="bg-red-400 text-green-100 px-2 py-1 rounded-r-md">
                    Secondary
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <DeleteWorkout workoutId={workout.workout_id} />
          <Overview workout={workout} workoutId={workout.workout_id} />
        </div>
      ))}
    </div>
  );
};
