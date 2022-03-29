import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';

export const DeleteWorkout = ({ workoutId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    console.log('clicked');
    setIsOpen(true);
  }

  const handleClick = async (id) => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:4000/workouts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then((res) => {
      return res.json();
    });

    if (response.status === 'success') {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Button onClick={openModal}>Delete workout</Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">Are you sure?</h2>
          <p>This workout will be removed. This action is permanent.</p>
          <div className="flex flex-col">
            <Button className="mt-4" onClick={() => handleClick(workoutId)}>
              Delete
            </Button>
            <Button className="mt-4" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
