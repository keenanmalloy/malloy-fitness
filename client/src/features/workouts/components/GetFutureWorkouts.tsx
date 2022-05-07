import React from 'react';
import { useFutureWorkoutsQuery } from 'features/workouts/api/useWorkoutsQuery';
import { Feed } from 'features/feed/Feed';

export const GetFutureWorkouts = () => {
  const { data, isError, isLoading } = useFutureWorkoutsQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data || !data.workouts) {
    return <p>none available...</p>;
  }

  return <Feed workouts={data.workouts} />;
};
