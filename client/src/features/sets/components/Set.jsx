import { Input } from 'features/form/Input';
import { useCreateSetMutation } from 'features/sets/api/useCreateSetMutation';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDeleteSetMutation } from '../api/useDeleteSetMutation';
import { useUpdateSetMutation } from '../api/useUpdateSetMutation';

export const Set = ({ set, setNumber, workoutId, exerciseId, isRemote }) => {
  const [repetitions, setRepetitions] = useState(set.repetitions);
  const [weight, setWeight] = useState(set.weight);
  const [setId, setSetId] = useState(set.set_id);
  const [hasSaved, setHasSaved] = useState(false);

  const { mutate, isLoading, isError } = useDeleteSetMutation({
    workoutId,
    setId,
  });

  return (
    <div className="flex items-center">
      <div className="pr-3">
        Set <span className="flex">{setNumber}</span>
      </div>
      <SavedInput
        set={set}
        exerciseId={exerciseId}
        workoutId={workoutId}
        onChange={(e) => setRepetitions(e.target.value)}
        value={repetitions}
        weight={weight}
        repetitions={repetitions}
        placeholder="6-8"
        name="repetitions"
        id="repetitions"
        setId={setId}
        setSetId={setSetId}
        hasSaved={hasSaved}
        setHasSaved={setHasSaved}
      />
      <SavedInput
        set={set}
        exerciseId={exerciseId}
        workoutId={workoutId}
        onChange={(e) => setWeight(e.target.value)}
        value={weight}
        weight={weight}
        repetitions={repetitions}
        placeholder="LBS"
        name="weight"
        id="weight"
        setId={setId}
        setSetId={setSetId}
        hasSaved={hasSaved}
        setHasSaved={setHasSaved}
      />
      <div className="pl-2">
        <button onClick={() => mutate()} className="bg-none">
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
  exerciseId,
  setId,
}) => {
  const { isLoading, mutate, isError } = useUpdateSetMutation({
    workoutId,
    setId,
  });

  const debouncedValue = useDebounce(value);

  useEffect(() => {
    if (repetitions && weight && debouncedValue) {
      mutate({
        repetitions,
        weight,
      });
    }
  }, [debouncedValue, exerciseId]);

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
