import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import React, { useState } from 'react';

export const DeleteExercise = ({ exerciseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    console.log('clikjed');
    setIsOpen(true);
  }

  const handleClick = async (id) => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:4000/exercises/${id}`, {
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
      <Button onClick={openModal}>Delete exercise</Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">Are you sure?</h2>
          <p>
            This exercise will be removed from your workout. This action is
            permanent.
          </p>
          <div className="flex flex-col">
            <Button className="mt-4" onClick={() => handleClick(exerciseId)}>
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
