import { useDebounce } from 'features/common/useDebounce';
import { Input } from 'features/form/Input';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDeleteSetMutation } from '../api/useDeleteSetMutation';
import { useUpdateSetMutation } from '../api/useUpdateSetMutation';

export const Set = ({
  set,
  setNumber,
  sessionId,
  exerciseId,
  isRemote,
  setRecord,
}) => {
  const [repetitions, setRepetitions] = useState(set.repetitions);
  const [weight, setWeight] = useState(set.weight);
  const [setId, setSetId] = useState(set.set_id);
  const [hasSaved, setHasSaved] = useState(false);

  const { mutate, isLoading, isError } = useDeleteSetMutation({
    sessionId,
    setId,
  });

  return (
    <div className="flex items-center">
      <div
        className="pr-3 text-md"
        style={{
          lineHeight: '0.2rem',
        }}
      >
        Set <span className="flex text-xl ">{setNumber}</span>
      </div>
      <div className="relative pt-2">
        <span
          className="absolute top-1 right-0 italic text-gray-600"
          style={{
            fontSize: '0.55rem',
          }}
        >
          {typeof setRecord !== 'undefined'
            ? `set record ${setRecord?.repetitions} reps`
            : null}
        </span>
        <SavedInput
          set={set}
          exerciseId={exerciseId}
          sessionId={sessionId}
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
      </div>
      <div className="relative pt-2">
        <span
          className="absolute top-1 right-0 italic text-gray-600"
          style={{
            fontSize: '0.55rem',
          }}
        >
          {typeof setRecord !== 'undefined'
            ? `set record ${setRecord?.weight}lbs`
            : null}
        </span>
        <SavedInput
          set={set}
          exerciseId={exerciseId}
          sessionId={sessionId}
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
      </div>
      <div className="pl-2">
        <button onClick={() => mutate()} className="bg-none">
          <IoClose className="w-4 h-5" />
        </button>
      </div>
    </div>
  );
};

const SavedInput = ({
  onChange,
  value,
  weight,
  repetitions,
  placeholder,
  name,
  id,
  sessionId,
  exerciseId,
  setId,
}) => {
  const { isLoading, mutate, isError } = useUpdateSetMutation({
    sessionId,
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
