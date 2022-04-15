import React from 'react';
import { WorkoutList } from 'features/workouts/components/WorkoutList';
import { useWorkoutsQuery } from 'features/workouts/api/useWorkoutsQuery';
import { Skeleton } from 'features/common/Skeleton';

export const GetAllWorkouts = () => {
  const { data, isError, isLoading } = useWorkoutsQuery();

  if (isLoading) {
    return (
      <section>
        <Skeleton className="h-40 w-full mt-2" />
        <Skeleton className="h-40 w-full mt-2" />
        <Skeleton className="h-40 w-full mt-2" />
        <Skeleton className="h-40 w-full mt-2" />
      </section>
    );
  }

  if (isError) {
    return <p className="w-full p-5 text-red-500">fetching error...</p>;
  }

  if (!data.workouts) {
    return <p className="w-full p-5">none available...</p>;
  }

  return <WorkoutList workouts={data.workouts} />;
};
