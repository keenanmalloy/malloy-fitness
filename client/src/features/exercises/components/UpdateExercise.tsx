import { Button } from 'features/common/Button';

import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';

import Modal from 'features/modal/Modal';
import { UpdateExerciseForm } from 'features/exercises/components/UpdateExerciseForm';
import { useMuscleGroupsQuery } from 'features/muscle-groups/api/useMuscleGroupsQuery';

interface Props {
  exercise: any;
  queryKey: string;
}

export const UpdateExercise = ({ exercise, queryKey }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isError, isLoading } = useMuscleGroupsQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center"
      >
        <MdEdit size={18} />
      </Button>

      <Modal
        isOpen={isOpen}
        title="Editing Muscle Group"
        description={'a form to edit a muscle-group'}
        closeModal={() => setIsOpen(false)}
      >
        <UpdateExerciseForm
          exercise={exercise}
          muscleGroups={data?.muscleGroups}
          queryKey={queryKey}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </>
  );
};
