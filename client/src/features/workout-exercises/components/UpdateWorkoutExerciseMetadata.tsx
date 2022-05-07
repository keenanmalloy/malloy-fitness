import React, { FormEvent } from 'react';
import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import Modal from 'features/modal/Modal';
import { useUpdateWorkoutExerciseMetadataMutation } from 'features/workout-exercises/api/useUpdateWorkoutExerciseMetadataMutation';
import { REP_RANGES, REST_PERIODS } from 'features/environment';

interface Props {
  workoutId: string;
  exerciseId: string;
  sets: string;
  restPeriod: string;
  weight: string;
  repsInReserve: string;
  repetitions: string;
  refetchKey: string;
}

const UpdateWorkoutExerciseMetadata = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refetchKey, workoutId, exerciseId } = props;
  const [sets, setSets] = useState(props.sets);
  const [repetitions, setRepetitions] = useState(props.repetitions);
  const [rir, setRir] = useState(props.repsInReserve);
  const [rest, setRest] = useState(props.restPeriod);

  const queryClient = useQueryClient();

  const { isLoading, mutate, isError } =
    useUpdateWorkoutExerciseMetadataMutation({ workoutId, exerciseId });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    mutate(
      { sets, repetitions, reps_in_reserve: rir, rest_period: rest },
      {
        onSuccess: () => {
          queryClient.refetchQueries(refetchKey);
          setIsOpen(false);
        },
      }
    );
  };
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Update</Button>

      <Modal
        isOpen={isOpen}
        title="Editing Exercise Metadata"
        description={'A form to edit exercise metadata'}
        closeModal={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setSets(e.target.value)}
            value={sets}
            label="Sets"
            placeholder="1-5"
          />
          <Input
            onChange={(e) => setRepetitions(e.target.value)}
            value={repetitions}
            label="Repetitions"
            placeholder={REP_RANGES.join(', ')}
          />
          <Input
            onChange={(e) => setRir(e.target.value)}
            value={rir}
            label="RIR"
            placeholder="0-4"
          />
          <Input
            onChange={(e) => setRest(e.target.value)}
            value={rest}
            label="Rest"
            placeholder={REST_PERIODS.join(', ')}
          />

          <Button isDisabled={isLoading} className="w-full mt-2">
            {isLoading ? 'Updating...' : 'Update'}
          </Button>

          {isError && (
            <small className="text-red-500 pt-2">Something went wrong...</small>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default UpdateWorkoutExerciseMetadata;
