import React from 'react';
import { AuthorizeGoogleFitButton } from './AuthorizeGoogleFitButton';

export const SleepPanel = ({ data }) => {
  if (data.steps === null) {
    return <AuthorizeGoogleFitButton />;
  }

  return (
    <div>
      <div className="text-center text-2xl text-slate-600">Sleep</div>
      <div className="flex justify-center text-center border-b-2 border-solid rounded-sm border-slate-400 mx-3 pb-2">
        7/10 hours (Daily/Weekly goal set in settings) Sleep Today
      </div>
    </div>
  );
};
