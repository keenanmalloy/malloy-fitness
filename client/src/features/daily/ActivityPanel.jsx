import React from 'react';
import { AuthorizeGoogleFitButton } from './AuthorizeGoogleFitButton';

export const ActivityPanel = ({ data }) => {
  if (data.steps === null) {
    return <AuthorizeGoogleFitButton />;
  }

  return (
    <div>
      <div className="text-center text-2xl text-slate-600">Activity</div>
      <div className="flex justify-center text-center mx-3 pb-2">
        {data.steps}/10000 (Daily/Weekly goal set in settings) Steps Today
      </div>
      <div className="flex justify-center text-center border-b-2 border-solid rounded-sm border-slate-400 mx-3 pb-2">
        30/180 minutes @ 140 BPM (Daily/Weekly goal set in settings) of Cardio
        Today
      </div>
    </div>
  );
};
