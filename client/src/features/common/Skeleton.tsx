import React from 'react';

export const Skeleton = ({ className }) => {
  return (
    <div className={`${className} rounded-sm bg-gray-200 animate-pulse`} />
  );
};
