import { MuscleGroups } from 'features/muscle-groups/MuscleGroups';
import Login from 'features/login/Login';
import React from 'react';
import Upload from 'features/Upload';
import { Profile } from 'features/account/Profile';
import { useWorkoutsQuery } from 'features/workouts/useWorkoutsQuery';
import { Button } from 'features/common/Button';
import { Sleep } from 'features/art/Sleep';
import { IndoorBike } from 'features/art/IndoorBike';

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
      {/* <Profile /> */}
      {/* These we can focus on later (was brainstorming), just need a list of any workouts for now. */}
      {/* 1. Today's Workout */}
      {/* 2. Users Created Workouts Feed*/}
      {/* 3. Default Workouts Feed (ones created by us)*/}
      <div className="flex items-center py-5">
        <p className="px-2 font-black">Today's Workout</p>
        <div className="h-0.5 w-full bg-gray-100" />
      </div>

      <div className="w-80 my-4 px-2">
        <div className="flex flex-row items-start gap-4 px-2">
          <div className="w-full flex flex-row justify-between">
            <div className="pt-2 w-40">
              <p className="text-xl font-medium">Rest Day!</p>
            </div>

            <Sleep />
          </div>
        </div>
      </div>

      <div className="flex items-center py-5">
        <p className="px-2 font-black">Tomorrows's Workout</p>
        <div className="h-0.5 w-full bg-gray-100" />
      </div>

      <div className="w-80 my-4 px-2">
        <div className="flex flex-row items-start gap-4 px-2">
          <div className="w-full flex flex-row justify-between">
            <div className="pt-2 w-40">
              <p className="text-xl font-medium">Schedule your next workout</p>
              <button className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32">
                Schedule
              </button>
            </div>

            <IndoorBike />
          </div>
        </div>
      </div>

      <div className="flex items-center py-5">
        <p className="px-2 font-black">Workouts</p>
        <div className="h-0.5 w-full bg-gray-100" />
      </div>

      {data.workouts.map((w) => {
        console.log({ w });
        return (
          <div className="w-80 mt-2 px-2 py-4" key={w.workout_id}>
            <div className="flex flex-row items-start gap-4">
              <div className="w-full flex flex-row justify-between">
                <div className="pt-2">
                  <p className="text-xl font-medium">{w.name}</p>
                  <p className="text-xs">{w.description}</p>
                </div>
                <aside className="flex flex-col justify-between">
                  {!!w.workout_dt ? (
                    <p className="font-black text-2xl text-right">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: '2-digit',
                      }).format(new Date(w.workout_dt))}
                    </p>
                  ) : (
                    <>
                      <div />
                      <button className="bg-white  ml-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32">
                        Schedule
                      </button>
                    </>
                  )}
                </aside>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-2">
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
