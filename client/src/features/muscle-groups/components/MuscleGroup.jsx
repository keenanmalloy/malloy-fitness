import { Skeleton } from 'features/common/Skeleton';
import React from 'react';
import { EditMuscleGroup } from 'features/muscle-groups/components/EditMuscleGroup';
import { useMuscleGroupQuery } from 'features/muscle-groups/api/useMuscleGroupQuery';
import Link from 'next/link';

export const MuscleGroup = ({ muscleGroupId }) => {
  const { data, isError, isFetching } = useMuscleGroupQuery(muscleGroupId);

  if (isFetching) {
    return (
      <div className="p-5">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-32 rounded-sm" />
          <Skeleton className="h-8 w-10 rounded-sm" />
        </div>

        <Skeleton className="h-44 w-full mt-5" />
        <Skeleton className="h-5 w-full mt-5" />
        <Skeleton className="h-3 w-full mt-2" />
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

  if (!data.muscleGroup) {
    return (
      <div className="p-5">
        <p>does not exist...</p>
      </div>
    );
  }

  return (
    <section className="p-5 relative">
      <header className="flex justify-between">
        <Link href={`/muscle-groups/`}>
          <button className="bg-white  text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32">
            Back
          </button>
        </Link>
        <EditMuscleGroup
          name={data.muscleGroup.name}
          description={data.muscleGroup.description}
          image={data.muscleGroup.image}
          id={data.muscleGroup.muscle_group_id}
          refetchKey="fetchMuscleGroup"
        />
      </header>

      <main className="pt-5">
        <h3 className="text-lg">{data.muscleGroup.name}</h3>
        <p className="text-xs">{data.muscleGroup.description}</p>
        {data.muscleGroup.image && <img src={data.muscleGroup.image} />}
      </main>
    </section>
  );
};
