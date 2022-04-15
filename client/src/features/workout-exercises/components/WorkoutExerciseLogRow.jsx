import { Button } from 'features/common/Button';
import { useCreateSetMutation } from 'features/sets/api/useCreateSetMutation';
import React, { useEffect, useState } from 'react';

const WorkoutExerciseLogRow = ({ set, setNumber, removeSet }) => {
  const [repetitions, setRepetitions] = useState(set.repetitions);
  const [weight, setWeight] = useState(set.weight);
  const { isLoading, mutate, isError } = useCreateSetMutation();

  useEffect(() => {
    if (
      repetitions &&
      weight &&
      repetitions !== set.repetitions &&
      weight !== set.weight
    ) {
      if (set.isDefault) {
        console.log('create');
      } else {
        console.log('update');
      }
      // mutate({
      //   variables: {
      //     input: {
      //       set_id: set.set_id,
      //       repetitions,
      //       weight,
      //     },
      //   },
      // });
    }
  }, [repetitions, weight]);

  return (
    <div className="flex">
      <div>
        Set <span className="flex">{setNumber}</span>
      </div>
      <input
        type="number"
        name="repetitions"
        id="repetitions"
        onChange={(e) => setRepetitions(e.target.value)}
        placeholder="6-8 reps"
        className="flex text-center"
        value={repetitions || ''}
      />
      <input
        type="number"
        name="weight"
        id="weight"
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weight (LBS)"
        className="flex text-center"
        value={weight || ''}
      />
      <Button onClick={() => removeSet(set.set_id)}>x</Button>
    </div>
  );
};

export default WorkoutExerciseLogRow;
