import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';
import { OverviewExercises } from 'features/workout-overview/OverviewExercises';

interface Props {
  sessionId: string;
}

const Overview = ({ sessionId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Overview
      </Button>

      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <OverviewExercises sessionId={sessionId} setIsOpen={setIsOpen} />
      </Modal>
    </>
  );
};

export default Overview;
