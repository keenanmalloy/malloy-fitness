import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';
import { OverviewExercises } from 'features/workout-overview/OverviewExercises';

const Overview = ({ workoutId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Details
      </Button>

      <Modal
        isOpen={isOpen}
        title="Workout Details"
        closeModal={() => setIsOpen(false)}
      >
        <OverviewExercises workoutId={workoutId} />
      </Modal>
    </>
  );
};

export default Overview;
