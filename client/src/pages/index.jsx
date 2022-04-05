import React from 'react';
import { useFutureWorkoutsQuery } from 'features/workouts/useWorkoutsQuery';
import { Feed } from 'features/feed/Feed';
import Overview from 'features/overview/Overview';

function HomePage() {
  const { data, isError, isLoading } = useFutureWorkoutsQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.workouts) {
    return <p>none available...</p>;
  }

  return (
    <div>
      <Overview workoutId={100} />
    </div>
  );
}

export default HomePage;
