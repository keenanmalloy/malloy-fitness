import React from 'react';
import { Divider } from 'features/feed/Divider';
import { Panel } from 'features/feed/Panel';
import { getFutureDate, isToday } from './utils';

export const Feed = ({ workouts }) => {
  return (
    <div className="pb-10">
      {Array.of(0, 1, 2, 3, 4, 5, 6).map((day) => {
        if (day === 0) {
          return (
            <React.Fragment key={day}>
              <Divider label="Today's Workout" />
              <Panel
                day={day}
                workouts={workouts.filter((workout) => {
                  if (!workout.workout_dt) {
                    return false;
                  }
                  return isToday(new Date(workout.workout_dt), day);
                })}
              />
            </React.Fragment>
          );
        }

        if (day === 1) {
          return (
            <React.Fragment key={day}>
              <Divider label="Tomorrows's Workout" />
              <Panel
                day={day}
                workouts={workouts.filter((workout) => {
                  if (!workout.workout_dt) {
                    return false;
                  }
                  return isToday(new Date(workout.workout_dt), day);
                })}
              />
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={day}>
            <Divider
              label={`${new Intl.DateTimeFormat('en-CA', {
                weekday: 'long',
              }).format(getFutureDate(day))}'s Workout`}
            />
            <Panel
              day={day}
              workouts={workouts.filter((workout) => {
                if (!workout.workout_dt) {
                  return false;
                }
                return isToday(new Date(workout.workout_dt), day);
              })}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
