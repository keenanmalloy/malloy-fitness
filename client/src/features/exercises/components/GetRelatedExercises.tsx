import { Skeleton } from 'features/common/Skeleton';
import React from 'react';
import { useRelatedExercisesQuery } from '../api/useRelatedExercisesQuery';
import Link from 'next/link';
import { IoIosArrowRoundForward } from 'react-icons/io';

interface Props {
  muscleGroupIds: string[];
  type: string;
  profile: string;
  category: string;
  exerciseId: string;
}

export const GetRelatedExercises = ({
  muscleGroupIds,
  type,
  profile,
  category,
  exerciseId,
}: Props) => {
  const { data, isError, isLoading } = useRelatedExercisesQuery({
    muscleGroupIds,
    type,
    profile,
    category,
    exerciseId,
  });

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

  if (!data || (data && !data.exercises.length)) {
    return (
      <div className="py-5">
        <h2 className="py-5 text-lg">Related exercises</h2>
        <p>No exercises found...</p>
      </div>
    );
  }

  return (
    <section className="py-5">
      <h2 className="py-3 text-lg underline">Related exercises</h2>
      <ul className="flex flex-col divide-gray-100  space-y-1">
        {data.exercises.map((e) => {
          return (
            <Link
              href={`/exercises/${e.exercise_id}`}
              as={`/exercises/${e.exercise_id}`}
              key={e.exercise_id}
            >
              <li className="border-solid py-4 bg-gray-50 flex justify-between px-3 rounded-sm">
                <p>{e.name}</p>
                <IoIosArrowRoundForward />
              </li>
            </Link>
          );
        })}
      </ul>
    </section>
  );
};
