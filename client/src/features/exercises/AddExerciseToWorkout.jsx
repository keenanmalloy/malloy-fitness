import React from 'react';
import { Button } from 'features/common/Button';
import { Fragment, useState } from 'react';
import Select from 'react-select';
import Modal from 'features/common/Modal';

const AddExerciseToWorkout = ({ data }) => {
  const [exercise, setExercise] = useState(null);
  const [order, setOrder] = useState(null);
  const [priority, setPriority] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError('Please select an exercise');
      return;
    }

    const payload = {
      exerciseId: exercise.value,
      order: order?.value ?? null,
      priority: priority?.value ?? null,
    };

    setIsLoading(true);
    fetch(`http://localhost:4000/workouts/${data.workout_id}/exercises/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error('could not add exercise');
        }
        console.log('new exercise added', { payload });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });

    closeModal();
  }

  return (
    <Fragment>
      <Button onClick={openModal}>Add Exercise</Button>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="block text-sm font-medium leading-5 text-gray-700">
                Exercise
              </label>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
                  Array.from(Array(data.exercises.length + 1).keys()).map(
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
