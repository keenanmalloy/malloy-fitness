import React from 'react';
import { WorkoutList } from 'features/workouts/components/WorkoutList';
import { useWorkoutsQuery } from 'features/workouts/api/useWorkoutsQuery';
import { Skeleton } from 'features/common/Skeleton';

interface Props {
  view: string;
  type: string;
  category: string;
  sortBy: string;
}

export const GetAllWorkouts = ({ view, type, category, sortBy }: Props) => {
  const { data, isError, isLoading } = useWorkoutsQuery({
    view,
    type,
    category,
    sortBy,
  });

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

  if (!data || !data.workouts) {
    return <p className="w-full p-5">none available...</p>;
  }

  return <WorkoutList workouts={data.workouts} />;
};
