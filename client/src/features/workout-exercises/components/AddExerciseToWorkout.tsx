import React, { FormEvent } from 'react';
import { Button } from 'features/common/Button';
import { Fragment, useState } from 'react';
import Select, { ActionMeta } from 'react-select';
import Modal from 'features/modal/Modal';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';
import { useAddExerciseToWorkoutMutation } from 'features/workout-exercises/api/useAddExerciseToWorkoutMutation';
import { AiOutlinePlus } from 'react-icons/ai';
import { Workout } from 'features/workouts/types';

interface Props {
  workout: Workout;
}

const AddExerciseToWorkout = ({ workout }: Props) => {
  const [exercise, setExercise] = useState<null | {
    value: number;
    label: string;
  }>(null);
  const [order, setOrder] = useState<null | {
    value: number;
    label: string;
  }>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isError, isLoading } = useExercisesQuery({});
  const { mutate } = useAddExerciseToWorkoutMutation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleExerciseChange(newValue: null, actionMeta: ActionMeta<never>) {
    setExercise(newValue);
  }

  function handleOrderChange(newValue: null, actionMeta: ActionMeta<never>) {
    setOrder(newValue);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!exercise) {
      // handle state error
      return;
    }

    const payload = {
      exerciseId: exercise.value,
      order: order?.value ?? null,
    };

    mutate({ workoutId: workout.workout_id, payload });

    closeModal();
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data || !data.exercises) {
    return <p>none available...</p>;
  }

  return (
    <Fragment>
      <Button onClick={openModal} className="px-0 py-2">
        <AiOutlinePlus className="h-6 w-10" />
      </Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-5 text-gray-700">
                Exercise
              </label>
              {isError && (
                <p className="mt-1 text-sm text-red-600">{isError}</p>
              )}
              <Select
                placeholder="Select an exercise..."
                id="long-value-select"
                instanceId="long-value-select"
                defaultValue={[]}
                name="exercise"
                options={data.exercises.map((ex) => {
                  return {
                    label: ex.name,
                    value: ex.exercise_id,
                  };
                })}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleExerciseChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-5 text-gray-700">
                Order
              </label>
              <Select
                placeholder="Select an order..."
                id="long-value-select"
                instanceId="long-value-select"
                defaultValue={[]}
                name="order"
                options={
                  // create dynamic array of objects with key value pairs
                  Array.from(Array(workout.exercises.length + 1).keys()).map(
                    (i) => {
                      return {
                        label: i + 1,
                        value: i + 1,
                      };
                    }
                  )
                }
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleOrderChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-5 text-gray-700">
                Priority
              </label>
              <Select
                placeholder="Select a priority..."
                id="long-value-select"
                instanceId="long-value-select"
                defaultValue={[]}
                name="priority"
                options={[
                  {
                    label: 1,
                    value: 1,
                  },
                  {
                    label: 2,
                    value: 2,
                  },
                  {
                    label: 3,
                    value: 3,
                  },
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handlePriorityChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default AddExerciseToWorkout;
