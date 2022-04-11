import React from 'react';
import { useFutureWorkoutsQuery } from 'features/workouts/api/useWorkoutsQuery';
import Overview from 'features/workout-overview/Overview';
import Layout from 'features/common/Layout';

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
    <Layout>
      <Overview workoutId={100} />
    </Layout>
  );
}

export default HomePage;
