import React from 'react';
import { Button } from 'features/common/Button';
import { WorkoutList } from 'features/workouts/components/WorkoutList';
import { useWorkoutsQuery } from 'features/workouts/api/useWorkoutsQuery';

export const GetAllWorkouts = () => {
  const { data, isError, isLoading } = useWorkoutsQuery();

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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <WorkoutList workouts={data.workouts} />
      )}
      <Button href="/workouts/create">Create workout</Button>
    </div>
  );
};
