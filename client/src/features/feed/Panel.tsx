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

interface Props {
  workouts: any[];
  day: number;
}

export const Panel = ({ workouts, day }: Props) => {
  if (!workouts.length) {
    return <ScheduleNextDay day={day} />;
  }

  return <ScheduledWorkouts workouts={workouts} />;
};

export const ScheduleNextDay = ({ day }: { day: number }) => {
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
    <div className="mb-2 px-2">
      <div className="flex flex-row items-start gap-4 px-2">
        <div className="w-full flex flex-row justify-between">
          <div className="pt-2 flex-4">
            <p className="text-lg font-medium leading-tight">
              Schedule your next workout
            </p>
            <Link href="/workouts">
              <button className="bg-white mt-2 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow w-32 text-sm">
                Schedule
              </button>
            </Link>
          </div>
          <div className="w-full flex justify-between px-2 items-center max-w-md">
            <ArtComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduledWorkouts = ({ workouts }: { workouts: any[] }) => {
  return (
    <>
      {workouts.map((w) => {
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
                <Button type="button" className="w-36" onClick={() => {}}>
                  Start
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 mt-2">
                <Button
                  type="button"
                  className="disabled:border-none disabled:opacity-30 px-10"
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
      })}
    </>
  );
};
