import { Button } from 'features/common/Button';
import Modal from 'features/modal/Modal';
import React, { useState } from 'react';
import { OverviewExercises } from 'features/workout-overview/OverviewExercises';

interface Props {
  sessionId: string;
}

const Overview = ({ sessionId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonStyle = `w-full py-2 px-4 text-sm font-medium bg-slate-800 rounded-md focus:z-10 focus:ring-1 focus:ring-green-300 focus:text-green-300`;

  return (
    <>
      <button className={buttonStyle} onClick={() => setIsOpen(true)}>
        Overview
      </button>

      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <OverviewExercises sessionId={sessionId} setIsOpen={setIsOpen} />
      </Modal>
    </>
  );
};

export default Overview;
