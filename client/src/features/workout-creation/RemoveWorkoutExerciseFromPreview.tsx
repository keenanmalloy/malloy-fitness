import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Button } from 'features/common/Button';
import { LocalExercise } from './CreateWorkout';
import { DefaultModal } from 'features/modal/DefaultModal';

interface Props {
  exercise: any; //GetExercisesResponse['exercises'][0];
  setExercises: (exercises: LocalExercise[]) => void;
  exercises: LocalExercise[];
}

export const RemoveWorkoutExerciseFromPreview = ({
  setExercises,
  exercises,
  exercise,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="ml-2 p-3"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <IoMdClose />
      </button>
      <DefaultModal
        closeModal={() => setIsOpen(false)}
        title={'Remove exercise'}
        description={'Would you like to remove this exercise from the workout?'}
        isOpen={isOpen}
      >
        <div className="flex justify-between pt-5">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              // @ts-ignore
              setExercises((prev: LocalExercise[]) => {
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
      </DefaultModal>
    </div>
  );
};
