import { Skeleton } from 'features/common/Skeleton';
import React from 'react';
import { useRelatedExercisesQuery } from '../api/useRelatedExercisesQuery';
import Link from 'next/link';

export const GetRelatedExercises = ({ muscleGroupIds }) => {
  const { data, isError, isLoading } = useRelatedExercisesQuery(muscleGroupIds);

  if (isLoading) {
    return (
      <div className="p-5">
        <Skeleton className="h-8 w-32 rounded-sm" />
        <Skeleton className="h-8 w-10 rounded-sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5">
        <p style={{ color: 'red' }}>fetching error...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-5">
        <p>does not exist...</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="py-5 text-lg">Related exercises</h2>
      {data.exercises.map((e) => {
        return (
          <div key={e.exercise_id}>
            <Link
              href={`/exercises/${e.exercise_id}`}
              as={`/exercises/${e.exercise_id}`}
            >
              {e.name}
            </Link>
          </div>
        );
      })}
    </section>
  );
};
