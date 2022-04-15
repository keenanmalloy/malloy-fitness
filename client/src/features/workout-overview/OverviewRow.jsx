import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import React from 'react';

export const OverviewRow = ({
  order,
  name,
  sets,
  reps,
  rir,
  rest,
  workoutId,
}) => {
  const { data, isError, isLoading } = useWorkoutQuery(workoutId);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data) {
    return <p>none available...</p>;
  }

  return (
    <li className="flex py-1">
      <div className="bg-cyan-700 text-white p-2 rounded-md">{order}</div>
      <div className="px-1 w-full">
        <div className="flex justify-between">
          <h3>{name}</h3>
        </div>
        <ul className="flex justify-between text-xs">
          <li className="uppercase">{sets}</li>
          <li className="uppercase">{reps}</li>
          <li className="uppercase">{rir}</li>
          <li>{rest}</li>
        </ul>
      </div>
    </li>
  );
};
