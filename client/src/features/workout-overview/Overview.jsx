import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';
import { OverviewExercises } from 'features/workout-overview/OverviewExercises';

const Overview = ({ sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Overview</Button>

      <Modal
        isOpen={isOpen}
        title="Workout Details"
        closeModal={() => setIsOpen(false)}
      >
        <OverviewExercises sessionId={sessionId} />
      </Modal>
    </>
  );
};

export default Overview;
