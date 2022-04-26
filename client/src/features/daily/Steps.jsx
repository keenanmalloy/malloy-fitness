import React from 'react';

export const Steps = ({ data }) => {
  if (data.steps === null) {
    return <div>First integrate with google-fit</div>;
  }

  return <div>Steps: {data.steps}</div>;
};
