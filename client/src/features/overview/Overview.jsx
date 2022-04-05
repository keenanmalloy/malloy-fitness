import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';
import { OverviewExercises } from './OverviewExercises';

const Overview = ({ workout, workoutId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Details</Button>

      <Modal
        isOpen={isOpen}
        title="Workout Details"
        closeModal={() => setIsOpen(false)}
      >
        <OverviewExercises workoutId={workoutId} />
      </Modal>
    </div>
  );
};

export default Overview;
