import React from 'react';
import { Sleep } from 'features/art/Sleep';
import { IndoorBike } from 'features/art/IndoorBike';
import { Button } from 'features/common/Button';
import { isToday } from './utils';
import { HealthyHabit } from 'features/art/HealthyHabit';
import { PersonalTrainer } from 'features/art/PersonalTrainer';
import { PersonalTraining } from 'features/art/PersonalTraining';
import { WorkingOut } from 'features/art/WorkingOut';
import { FitnessTracker } from 'features/art/FitnessTracker';
import { FitnessStats } from 'features/art/FitnessStats';
import Link from 'next/link';

export const Panel = ({ workouts, day }) => {
  if (!workouts.length) {
    return <ScheduleNextDay day={day} />;
  }

  return <ScheduledWorkouts workouts={workouts} />;
};

const RestDay = () => {
  return (
    <div className="my-4 px-2">
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

const ScheduleNextDay = ({ day }) => {
  const ArtComponent = () => {
    switch (day) {
      case 0:
        return <HealthyHabit />;
      case 1:
        return <IndoorBike />;
      case 2:
        return <PersonalTrainer />;
      case 3:
        return <FitnessStats />;
      case 4:
        return <PersonalTraining />;
      case 5:
        return <WorkingOut />;
      case 6:
        return <FitnessTracker />;
      default:
        return <FitnessStats />;
    }
  };

  return (
    <div className="my-4 px-2">
      <div className="flex flex-row items-start gap-4 px-2">
        <div className="w-full flex flex-row justify-between">
          <div className="pt-2">
            <p className="text-xl font-medium">Schedule your next workout</p>
            <Link href="/workouts">
              <button className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32">
                Schedule
              </button>
            </Link>
          </div>

          <ArtComponent />
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
      <div className="mt-2 px-2 py-4" key={w.workout_id}>
        <div className="flex flex-row items-start gap-4">
          <div className="w-full flex flex-row justify-between">
            <div className="pt-2 w-52">
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

        {isToday(new Date(w.workout_dt)) ? (
          <div className="flex items-center justify-between gap-4 mt-2">
            <Button
              type="button"
              className="w-full"
              onClick={() => startWorkout(w.workout_id)}
            >
              Start
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 mt-2">
            <Button
              type="button"
              className="w-full disabled:border-none disabled:opacity-30"
              isDisabled
            >
              Scheduled for{' '}
              {new Intl.DateTimeFormat('en-CA', {
                weekday: 'short',
              }).format(new Date(w.workout_dt))}
            </Button>
          </div>
        )}
      </div>
    );
  });
};
