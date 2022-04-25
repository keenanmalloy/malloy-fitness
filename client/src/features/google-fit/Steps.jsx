import React from 'react';
import { useStepsQuery } from './useStepsQuery';

export const Steps = ({ selected }) => {
  const start = new Date(
    new Intl.DateTimeFormat('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(
      selected.id
        ? new Date(selected.year, selected.month - 1, selected.day)
        : new Date()
    )
  ).setHours(0, 0, 0, 0);

  const end = new Date(
    new Intl.DateTimeFormat('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(
      selected.id
        ? new Date(selected.year, selected.month - 1, selected.day)
        : new Date()
    )
  ).setHours(23, 59, 59, 999);

  const { data, isLoading, isError } = useStepsQuery({
    startTimeMillis: start,
    endTimeMillis: end,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  if (data.error) {
    return <p>{data.error}</p>;
  }

  return <div>{data.steps}</div>;
};
