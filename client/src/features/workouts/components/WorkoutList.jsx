import React from 'react';
import Link from 'next/link';
import { DeleteWorkout } from 'features/workouts/components/DeleteWorkout';
import Overview from 'features/workout-overview/Overview';

export const WorkoutList = ({ workouts }) => {
  return (
    <section className="divide-y-2 divide-gray-100">
      {workouts.map((workout) => (
        <article
          className="flex flex-col py-2 border-solid"
          key={workout.workout_id}
        >
          <Link href={`/workouts/${workout.workout_id}`}>
            <div>
              <h2 className="text-3xl font-bold">{workout.name}</h2>
              <p>{workout.category}</p>
              <p>{workout.description}</p>
              <p>{workout.workout_id}</p>
            </div>
          </Link>
          <DeleteWorkout workoutId={workout.workout_id} />
          <Overview workout={workout} workoutId={workout.workout_id} />
        </article>
      ))}
    </section>
  );
};
