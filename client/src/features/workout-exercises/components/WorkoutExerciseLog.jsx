import { useSetsByExerciseQuery } from 'features/sets/api/useSetsByExerciseQuery';
import React from 'react';
import WorkoutExerciseLogRow from './WorkoutExerciseLogRow';

const WorkoutExerciseLog = ({ workoutId, exerciseId }) => {
  const { data, isError, isLoading } = useSetsByExerciseQuery(
    workoutId,
    exerciseId
  );

  if (isError) {
    return <div>Error!</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-evenly">
        <p>Reps</p>
        <p>Weight (LBS)</p>
      </div>
      <ul className="py-1">
        {data.sets.map((set) => (
          <li className="py-1">
            <WorkoutExerciseLogRow setNumber="01" repNumber="10-12" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutExerciseLog;
