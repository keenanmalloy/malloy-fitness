import { MuscleGroups } from 'features/muscle-groups/MuscleGroups';
import Login from 'features/login/Login';
import React from 'react';
import Upload from 'features/Upload';
import { Profile } from 'features/account/Profile';
import { useWorkoutsQuery } from 'features/workouts/useWorkoutsQuery';
import { Button } from 'features/common/Button';

function HomePage() {
  const { data, isError, isLoading } = useWorkoutsQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.workouts) {
    return <p>none available...</p>;
  }

  const startWorkout = (id) => {
    console.log({ id });

    // GET /workouts/:pk and distinguish the first exercise within the workout
    // if success, continue
    // if error, show error in UI & do not run the following PATCH

    // PATCH /workouts/:pk/start
    // If successful
    // redirect to page localhost:3000/workouts/:pk/exercises/:pk
    // If error
    // show same error in UI as above
  };

  return (
    <div>
      <Profile />
      {/* These we can focus on later (was brainstorming), just need a list of any workouts for now. */}
      {/* 1. Today's Workout */}
      {/* 2. Users Created Workouts Feed*/}
      {/* 3. Default Workouts Feed (ones created by us)*/}
      {data.workouts.map((w) => {
        return (
          <div
            className="shadow-lg rounded-2xl w-80 p-4 bg-gray-800 mt-5"
            key={w.workout_id}
          >
            <div className="flex flex-row items-start gap-4">
              <div className="w-full flex flex-col justify-between">
                <div>
                  <p className="text-white text-xl font-medium">{w.name}</p>
                  <p className="text-gray-300 text-xs">{w.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-6">
              <Button
                type="button"
                className="w-full"
                onClick={() => startWorkout(w.workout_id)}
              >
                Start
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HomePage;
