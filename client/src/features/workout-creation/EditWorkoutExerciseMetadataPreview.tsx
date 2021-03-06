import { Button } from 'features/common/Button';
import Modal from 'features/modal/Modal';
import { Input } from 'features/form/Input';
import React, { FormEvent, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { LocalExercise } from './CreateWorkout';
import { DefaultModal } from 'features/modal/DefaultModal';

interface Props {
  exercises: LocalExercise[];
  setExercises: (exercises: LocalExercise[]) => void;
  exerciseId: string;
}

export const EditWorkoutExerciseMetadataPreview = ({
  exercises,
  setExercises,
  exerciseId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [sets, setSets] = useState(
    exercises.filter((ex) => {
      return ex.id === exerciseId;
    })[0].sets ?? ''
  );

  const [repetitions, setRepetitions] = useState(
    exercises.filter((ex) => {
      return ex.id === exerciseId;
    })[0].repetitions ?? ''
  );

  const [rir, setRir] = useState(
    exercises.filter((ex) => {
      return ex.id === exerciseId;
    })[0].repsInReserve ?? ''
  );

  const [rest, setRest] = useState(
    exercises.filter((ex) => {
      return ex.id === exerciseId;
    })[0].restPeriod ?? ''
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // filter out changed exercise from array and replace with new one
    const newExercise = exercises
      .filter((ex) => {
        return ex.id === exerciseId;
      })
      .map((ex) => {
        return {
          ...ex,
          sets,
          repetitions,
          repsInReserve: rir,
          restPeriod: rest,
        };
      })[0];

    const filteredExercises = exercises.filter((ex) => {
      return ex.id !== exerciseId;
    });

    const newExercises = [...filteredExercises, newExercise];
    setExercises(newExercises);
  };

  return (
    <>
      <button
        className="ml-2 p-3"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <MdEdit />
      </button>
      <DefaultModal
        closeModal={() => setIsOpen(false)}
        title={'Update exercise metadata'}
        description={''}
        isOpen={isOpen}
      >
        <form onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setSets(+e.target.value)}
            value={sets}
            label="sets"
          />
          <Input
            onChange={(e) => setRepetitions(+e.target.value)}
            value={repetitions}
            label="repetitions"
          />
          <Input
            onChange={(e) => setRir(+e.target.value)}
            value={rir}
            label="RIR"
          />
          <Input
            onChange={(e) => setRest(+e.target.value)}
            value={rest}
            label="rest period"
          />
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Save
          </Button>
        </form>
      </DefaultModal>
    </>
  );
};
