import React from 'react';
import { Divider } from 'features/feed/Divider';
import { Panel } from 'features/feed/Panel';

export const Feed = ({ workouts }) => {
  return (
    <div>
      {Array.of(0, 1, 2, 3, 4, 5, 6).map((day) => {
        if (day === 0) {
          return (
            <>
              <Divider label="Today's Workout" />
              <Panel
                workouts={workouts.filter((workout) => {
                  if (!workout.workout_dt) {
                    return false;
                  }
                  return isToday(new Date(workout.workout_dt), day);
                })}
              />
            </>
          );
        }

        if (day === 1) {
          return (
            <>
              <Divider label="Tomorrows's Workout" />
              <Panel
                workouts={workouts.filter((workout) => {
                  if (!workout.workout_dt) {
                    return false;
                  }
                  return isToday(new Date(workout.workout_dt), day);
                })}
              />
            </>
          );
        }

        return (
          <>
            <Divider
              label={`${new Intl.DateTimeFormat('en-CA', {
                weekday: 'long',
              }).format(getFutureDate(day))}'s Workout`}
            />
            <Panel
              workouts={workouts.filter((workout) => {
                if (!workout.workout_dt) {
                  return false;
                }
                return isToday(new Date(workout.workout_dt), day);
              })}
            />
          </>
        );
      })}
    </div>
  );
};

const isToday = (someDate, index) => {
  const today = getFutureDate(index);
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const getFutureDate = (index) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + index);
  return futureDate;
};
