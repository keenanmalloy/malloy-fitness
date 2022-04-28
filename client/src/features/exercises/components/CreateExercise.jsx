import { Button } from 'features/common/Button';
import { useMuscleGroupsQuery } from 'features/muscle-groups/api/useMuscleGroupsQuery';
import FullPageModal from 'features/common/FullPageModal';
import { useState } from 'react';
import { CreateExerciseForms } from './CreateExerciseForms';
import Modal from 'features/common/Modal';

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
        Create Exercise
      </Button>
      <FullPageModal
        isOpen={isOpen}
        title=""
        description=""
        closeModal={() => setIsOpen(false)}
      >
        <CreateExerciseForms
          muscleGroups={data.muscleGroups}
          setIsOpen={setIsOpen}
        />
      </FullPageModal>
    </>
  );
};
