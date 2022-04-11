import React from 'react';
import { Button } from 'features/common/Button';
import { WorkoutList } from 'features/workouts/components/WorkoutList';
import { useWorkoutsQuery } from 'features/workouts/api/useWorkoutsQuery';

export const GetAllWorkouts = () => {
  const { data, isError, isLoading } = useWorkoutsQuery();

  if (isLoading) {
    return <p className="w-full p-5">loading...</p>;
  }

  if (isError) {
    return <p className="w-full p-5 text-red-500">fetching error...</p>;
  }

  if (!data.workouts) {
    return <p className="w-full p-5">none available...</p>;
  }
  return (
    <div className="w-full p-5">
      <WorkoutList workouts={data.workouts} />
      <Button href="/workouts/create" className="w-full">
        Create workout
      </Button>
    </div>
  );
};
