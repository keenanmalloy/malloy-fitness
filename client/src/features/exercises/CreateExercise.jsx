import { Button } from 'features/common/Button';
import { useMuscleGroupsQuery } from 'features/muscle-groups/useMuscleGroupsQuery';
import Modal from 'features/common/Modal';
import { CreateExerciseForm } from './CreateExerciseForm';
import { useState } from 'react';

export const CreateExercise = () => {
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
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Create
      </Button>
      <Modal
        isOpen={isOpen}
        title="Create an exercise"
        description="A form to create an exercise"
        closeModal={() => setIsOpen(false)}
      >
        <CreateExerciseForm muscleGroups={data.muscleGroups} />
      </Modal>
    </>
  );
};
