import React from 'react';
import { useMuscleGroupQuery } from './useMuscleGroupQuery';

export const MuscleGroup = ({ muscleGroupId }) => {
  const { data, isError, isLoading } = useMuscleGroupQuery(muscleGroupId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.muscleGroup) {
    return <p>does not exist...</p>;
  }

  return (
    <section>
      <h3 className="text-lg">{data.muscleGroup.name}</h3>
      <p className="text-xs">{data.muscleGroup.description}</p>
    </section>
  );
};
