import React, { useState } from 'react';
import { useSetsByExerciseQuery } from 'features/sets/api/useSetsByExerciseQuery';
import { Button } from 'features/common/Button';
import { Set } from 'features/sets/components/Set';
import { v4 as uuidv4 } from 'uuid';

export const GetExerciseSets = ({ workoutId, exerciseId }) => {
  const { data, isError, isLoading, isFetching } = useSetsByExerciseQuery(
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
    <SetsList sets={data.sets} workoutId={workoutId} exerciseId={exerciseId} />
  );
};

const SetsList = (props) => {
  const [sets, setSets] = useState(
    props.sets.length
      ? props.sets
      : [
          { repetitions: 0, weight: 0, set_id: uuidv4(), isDefault: true },
          { repetitions: 0, weight: 0, set_id: uuidv4(), isDefault: true },
        ]
  );

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
    <section className="px-3">
      <ul>
        {sets.map((set, key) => {
          return (
            <Set
              set={set}
              removeSet={removeSet}
              key={set.set_id}
              setNumber={`0${key + 1}`}
              workoutId={props.workoutId}
              exerciseId={props.exerciseId}
            />
          );
        })}
      </ul>
      <div className="flex justify-end py-5">
        <Button onClick={addSet}>+ Add Set</Button>
      </div>
    </section>
  );
};
