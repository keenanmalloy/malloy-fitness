import { useWorkoutQuery } from 'features/workouts/api/useWorkoutQuery';
import React from 'react';
import { GrPowerCycle } from 'react-icons/gr';

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
      <div className="bg-cyan-700 text-white p-2 rounded-md max-h-8">
        {order}
      </div>
      <div className="px-1 w-full">
        <div className="flex justify-between">
          <h3>{name}</h3>
          <button>
            <GrPowerCycle onClick={handleSwap} />
          </button>
        </div>
        <ul
          style={{
            fontSize: '0.57rem',
          }}
          className="flex justify-between pt-0.5"
        >
          <li className="uppercase">{sets}</li>
          <li className="uppercase">{reps}</li>
          <li className="uppercase">{rir}</li>
          <li className="">{rest}</li>
        </ul>
      </div>
    </li>
  );
};
