import React from 'react';
import { Sleep } from 'features/art/Sleep';
import { IndoorBike } from 'features/art/IndoorBike';
import { Button } from 'features/common/Button';

export const Panel = ({ workouts }) => {
  if (!workouts.length) {
    return <ScheduleNextDay />;
  }

  return <ScheduledWorkouts workouts={workouts} />;
};

const RestDay = () => {
  return (
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
  );
};

const ScheduleNextDay = () => {
  return (
    <div className="w-80 my-4 px-2">
      <div className="flex flex-row items-start gap-4 px-2">
        <div className="w-full flex flex-row justify-between">
          <div className="pt-2 w-40">
            <p className="text-xl font-medium">Schedule your next workout</p>
            <button className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32">
              Schedule
            </button>
            {/* <Schedule /> */}
          </div>

          <IndoorBike />
        </div>
      </div>
    </div>
  );
};

const ScheduledWorkouts = ({ workouts }) => {
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

  return workouts.map((w) => {
    return (
      <div className="w-80 mt-2 px-2 py-4" key={w.workout_id}>
        <div className="flex flex-row items-start gap-4">
          <div className="w-full flex flex-row justify-between">
            <div className="pt-2">
              <p className="text-xl font-medium">{w.name}</p>
              <p className="text-xs">{w.description}</p>
            </div>
            <aside className="flex flex-col justify-between">
              <p className="font-black text-2xl text-right">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                }).format(new Date(w.workout_dt))}
              </p>
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
  });
};
