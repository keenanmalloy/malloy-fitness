import Overview from 'features/workout-overview/Overview';
import React from 'react';

export const TrainingPanel = ({ data }) => {
  if (!data.sessions.length) {
    return (
      <div className="border-b border-slate-400">
        <div className="h-32 flex justify-center pt-4"></div>
        <div className="flex justify-center border-b-2 border-solid rounded-sm border-slate-400 mx-3 pb-4">
          <div className="flex flex-col text-center text-slate-600">
            No training tracked for today
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-slate-400">
      <div className="h-32 flex justify-center pt-4"></div>
      <div className="flex justify-center border-b-2 border-solid rounded-sm border-slate-400 mx-3 pb-4">
        <div className="flex flex-col text-center text-slate-600">
          {data.sessions.length} sessions tracked for today
          {data.sessions.map((session) => {
            return <Overview workoutId={session.workout_id} />;
          })}
        </div>
      </div>
    </div>
  );
};
