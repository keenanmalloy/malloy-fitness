import React, { useState } from 'react';
import { useSetsByExerciseQuery } from 'features/sets/api/useSetsByExerciseQuery';
import { Button } from 'features/common/Button';
import WorkoutExerciseLogRow from 'features/workout-exercises/components/WorkoutExerciseLogRow';
import { v4 as uuidv4 } from 'uuid';

export const GetExerciseSets = ({ workoutId, exerciseId }) => {
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
      <SetsList sets={data.sets} />
    </div>
  );
};

const SetsList = () => {
  const [sets, setSets] = useState([
    { repetitions: 0, weight: 0, set_id: uuidv4(), isDefault: true },
    { repetitions: 0, weight: 0, set_id: uuidv4(), isDefault: true },
  ]);

  const addSet = () => {
    const set = {
      repetitions: 0,
      weight: 0,
      set_id: uuidv4(),
      isDefault: true,
    };
    setSets([...sets, set]);
  };

  const removeSet = (setId) => {
    const newSets = sets.filter((set) => set.set_id !== setId);
    setSets(newSets);
  };

  return (
    <div>
      <div>
        {sets.map((set) => {
          return <WorkoutExerciseLogRow set={set} removeSet={removeSet} />;
        })}
      </div>
      <Button onClick={addSet}>+ Add Set</Button>
    </div>
  );
};
