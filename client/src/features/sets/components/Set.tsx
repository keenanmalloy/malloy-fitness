import { useDebounce } from 'features/common/useDebounce';
import { Input } from 'features/form/Input';
import React, { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IoClose } from 'react-icons/io5';
import { useDeleteSetMutation } from '../api/useDeleteSetMutation';
import { useUpdateSetMutation } from '../api/useUpdateSetMutation';

interface Props {
  set: any;
  setNumber: number | string;
  sessionId: string;
  exerciseId: string;
  setRecord: {
    weight: number;
    repetitions: number;
  };
}

export const Set = ({
  set,
  setNumber,
  sessionId,
  exerciseId,
  setRecord,
}: Props) => {
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
      <div className="pr-3 text-md">
        <p className="-my-2">Set</p>
        <span className="flex text-2xl -my-2">{setNumber}</span>
      </div>

      <div className="relative pr-1">
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
          exerciseId={exerciseId}
          sessionId={sessionId}
          onChange={(e) => setWeight(e.target.value)}
          value={weight}
          weight={weight}
          repetitions={repetitions}
          placeholder="lbs"
          name="weight"
          id="weight"
          setId={setId}
        />
      </div>

      <div className="relative pl-1">
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
        />
      </div>

      <div className="pl-2">
        <button onClick={() => mutate()} className="bg-none">
          {isLoading ? (
            <CgSpinner size={16} className="animate-spin text-green-500" />
          ) : (
            <IoClose className="w-4 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

interface SavedInputProps {
  sessionId: string;
  exerciseId: string;
  onChange: (e: any) => void;
  value: string;
  weight: string;
  repetitions: string;
  placeholder: string;
  name: string;
  id: string;
  setId: string;
}

const SavedInput = ({
  onChange,
  value,
  weight,
  repetitions,
  placeholder,
  sessionId,
  exerciseId,
  setId,
}: SavedInputProps) => {
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
      label=""
      type="number"
      onChange={onChange}
      placeholder={placeholder}
      value={value || ''}
      isLoading={isLoading}
    />
  );
};
