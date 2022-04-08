import { Button } from 'features/common/Button';

import React, { useState } from 'react';

import Modal from 'features/common/Modal';
import { UpdateExerciseForm } from 'features/exercises/components/UpdateExerciseForm';
import { useMuscleGroupsQuery } from 'features/muscle-groups/api/useMuscleGroupsQuery';

export const UpdateExercise = ({ exercise, queryKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isError, isLoading } = useMuscleGroupsQuery();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Update Exercise</Button>

      <Modal
        isOpen={isOpen}
        title="Editing Muscle Group"
        description={'a form to edit a muscle-group'}
        closeModal={() => setIsOpen(false)}
      >
        <UpdateExerciseForm
          exercise={exercise}
          muscleGroups={data.muscleGroups}
          queryKey={queryKey}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </>
  );
};
