import React from 'react';
import { AuthorizeGoogleFitButton } from './AuthorizeGoogleFitButton';

export const HealthPanel = ({ data }) => {
  if (data.steps === null) {
    return <AuthorizeGoogleFitButton />;
  }

  return (
    <div>
      <div className="text-center text-2xl text-slate-600">Health</div>
      <div className="flex justify-between pt-3">
        <div>blood pressure: {data.blood_pressure}</div>
        <div>resting heart rate: {data.resting_heart_rate}</div>
        <div>blood glucose: {data.blood_glucose}</div>
      </div>
    </div>
  );
};
