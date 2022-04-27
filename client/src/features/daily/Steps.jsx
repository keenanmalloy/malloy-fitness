import React from 'react';
import { AuthorizeGoogleFitButton } from './AuthorizeGoogleFitButton';

export const Steps = ({ data }) => {
  if (data.steps === null) {
    return <AuthorizeGoogleFitButton />;
  }

  return (
    <div className="flex justify-center items-center p-5">
      <h2>Steps Today: </h2>
      <div className="px-2">{data.steps}</div>
    </div>
  );
};
