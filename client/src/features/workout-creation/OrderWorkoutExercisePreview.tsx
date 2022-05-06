import React from 'react';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';

export const OrderWorkoutExercisePreview = ({
  exercises,
  setExercises,
  exercise,
}) => {
  return (
    <div>
      <button
        className="ml-2"
        type="button"
        onClick={() => {
          setExercises((prev) => {
            const updateable = prev.filter(
              (ex) => ex.id === exercise.exercise_id
            )[0];

            const newOrderedExercise = {
              ...updateable,
              order: updateable.order + 1,
            };

            const updatedOrders = prev.map((d) => {
              return {
                ...d,
                order: updateable.order + 1 === d.order ? d.order - 1 : d.order,
              };
            });

            return [
              ...updatedOrders.filter((ex) => ex.id !== exercise.exercise_id),
              newOrderedExercise,
            ];
          });
        }}
      >
        <BsArrowDown />
      </button>
      <button
        className="ml-2"
        type="button"
        onClick={() => {
          setExercises((prev) => {
            const updateable = prev.filter(
              (ex) => ex.id === exercise.exercise_id
            )[0];

            const newOrderedExercise = {
              ...updateable,
              order: updateable.order - 1,
            };

            const updatedOrders = prev.map((d) => {
              return {
                ...d,
                order: updateable.order - 1 === d.order ? d.order + 1 : d.order,
              };
            });

            return [
              ...updatedOrders.filter((ex) => ex.id !== exercise.exercise_id),
              newOrderedExercise,
            ];
          });
        }}
      >
        <BsArrowUp />
      </button>
    </div>
  );
};
