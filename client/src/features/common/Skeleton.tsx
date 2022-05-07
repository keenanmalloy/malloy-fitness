import React from 'react';

interface SkeletonProps {
  className: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={`${className} rounded-sm bg-gray-200 animate-pulse`} />
  );
};
