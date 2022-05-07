import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Modal from 'features/modal/Modal';
import { Button } from 'features/common/Button';

export const RemoveWorkoutExerciseFromPreview = ({
  setExercises,
  exercises,
  exercise,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="ml-2" type="button" onClick={() => setIsOpen(true)}>
        <IoMdClose />
      </button>
      <Modal
        closeModal={() => setIsOpen(false)}
        title={'Remove exercise'}
        description={'Would you like to remove this exercise from the workout?'}
        isOpen={isOpen}
      >
        <div className="flex justify-between pt-5">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setExercises((prev) => {
                const removeableOrder = prev.filter(
                  (ex) => ex.id === exercise.exercise_id
                )[0].order;

                const updatedOrders = prev.map((d) => {
                  return {
                    ...d,
                    order: removeableOrder < d.order ? d.order - 1 : d.order,
                  };
                });

                return updatedOrders.filter(
                  (ex) => ex.id !== exercise.exercise_id
                );
              });
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};
