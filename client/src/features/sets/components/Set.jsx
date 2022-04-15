import { Input } from 'features/form/Input';
import { useCreateSetMutation } from 'features/sets/api/useCreateSetMutation';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useUpdateSetMutation } from '../api/useUpdateSetMutation';

export const Set = ({ set, setNumber, removeSet, workoutId }) => {
  const [repetitions, setRepetitions] = useState(set.repetitions);
  const [weight, setWeight] = useState(set.weight);

  return (
    <div className="flex items-center">
      <div className="pr-3">
        Set <span className="flex">{setNumber}</span>
      </div>
      {/* <Input
        type="number"
        name="repetitions"
        id="repetitions"
        onChange={(e) => setRepetitions(e.target.value)}
        placeholder="6-8"
        className="flex text-center"
        value={repetitions || ''}
      /> */}
      <SavedInput
        set={set}
        onChange={(e) => setRepetitions(e.target.value)}
        value={repetitions}
        weight={weight}
        repetitions={repetitions}
        placeholder="6-8"
        name="repetitions"
        id="repetitions"
      />
      {/* <Input
        type="number"
        name="weight"
        id="weight"
        onChange={(e) => setWeight(e.target.value)}
        placeholder="LBS"
        className="flex text-center"
        value={weight || ''}
      /> */}
      <SavedInput
        set={set}
        workoutId={workoutId}
        onChange={(e) => setWeight(e.target.value)}
        value={weight}
        weight={weight}
        repetitions={repetitions}
        placeholder="LBS"
        name="weight"
        id="weight"
      />
      <div className="pl-2">
        <button onClick={() => removeSet(set.set_id)} className="bg-none">
          <IoClose className="w-4 h-5" />
        </button>
      </div>
    </div>
  );
};

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SavedInput = ({
  onChange,
  value,
  weight,
  repetitions,
  placeholder,
  name,
  id,
  workoutId,
  set,
}) => {
  const { isLoading, mutate, isError } = useCreateSetMutation({ workoutId });
  const {
    isLoading: isLoading2,
    mutate: mutate2,
    isError: isError2,
  } = useUpdateSetMutation({ workoutId, setId: set.set_id });

  const debouncedValue = useDebounce(value);

  useEffect(() => {
    if (repetitions && weight && debouncedValue) {
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
  }, [debouncedValue]);

  return (
    <Input
      type="number"
      name={name}
      id={id}
      onChange={onChange}
      placeholder={placeholder}
      className="flex text-center"
      value={value || ''}
      isLoading={isLoading}
    />
  );
};
