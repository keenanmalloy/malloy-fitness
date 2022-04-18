import React from 'react';
import { Button } from 'features/common/Button';
import { Fragment, useState } from 'react';
import Select from 'react-select';
import Modal from 'features/common/Modal';
import { useExercisesQuery } from 'features/exercises/api/useExercisesQuery';
import { useAddExerciseToWorkoutMutation } from 'features/workout-exercises/api/useAddExerciseToWorkoutMutation';
import { AiOutlinePlus } from 'react-icons/ai';

const AddExerciseToWorkout = ({ workout }) => {
  const [exercise, setExercise] = useState(null);
  const [order, setOrder] = useState(null);
  const [priority, setPriority] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isError, isLoading } = useExercisesQuery({});
  const { mutate } = useAddExerciseToWorkoutMutation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleExerciseChange(selectedOption) {
    setExercise(selectedOption);
  }

  function handleOrderChange(selectedOption) {
    setOrder(selectedOption);
  }

  function handlePriorityChange(selectedOption) {
    setPriority(selectedOption);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!exercise) {
      // handle state error
      return;
    }

    const payload = {
      exerciseId: exercise.value,
      order: order?.value ?? null,
      priority: priority?.value ?? null,
    };

    console.log({ payload });

    mutate({ workoutId: workout.workout_id, payload });

    closeModal();
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data.exercises) {
    return <p>none available...</p>;
  }

  console.log({ data });

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
