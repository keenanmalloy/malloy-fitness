import React from 'react';
import { Button } from 'features/common/Button';
import { Dialog, Transition } from '@headlessui/react';
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
  // 3. A function that handles the POST request fetching logic to update the workout in the database.
  //    We'll need a loading & error state. If the action is successful, then lets close the modal.
  //
  //    POST request to /workouts/:pk/exercises
  //
  //    Example body:
  //
  //    {
  //      "order": 5,
  //      "priority": 3,
  //      "exerciseId": 4,
  //    }

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

// How can we add an Exercise to the Workout?
// We need a few things.
// 1. a) A list of exercises the user can select.
//      *hint* comment below above the <Select> component.
//    b) A number input so we can change the order (could just be a counter)
//    c) A number input so we can change the priority (could just be a counter)
//
// 2. a) State so we can hold the users exercise selection.
//    b) State so we can hold the users order number. (ex. 1-99)
//    c) State so we can hold the priority number. (ex. 1-99)
//
// 3. A function that handles the POST request fetching logic to update the workout in the database.
//    We'll need a loading & error state. If the action is successful, then lets close the modal.
//
//    POST request to /workouts/:pk/exercises
//
//    Example body:
//
//    {
//      "order": 5,
//      "priority": 3,
//      "exerciseId": 4,
//    }

//   return (
//     <>
//       <button
//         type="button"
//         onClick={openModal}
//         className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
//       >
//         Add exercise to workout
//       </button>
//       <Modal
//         isOpen={isOpen}
//         title="Add exercise to workout"
//         description="Select an exercise and add it to the workout."
//         closeModal={closeModal}
//       >
//         <div className="mt-2">
//           <div className="text-sm text-gray-500">
//             <Select
//               placeholder="Select an exercise..."
//               id="long-value-select"
//               instanceId="long-value-select"
//               defaultValue={[]}
//               isMulti
//               onChange={(data) => setExercise(data)}
//               name="muscleGroups"
//               options={data.exercises.map((ex) => {
//                 return {
//                   label: ex.name,
//                   value: ex.exercise_id,
//                 };
//               })}
//               className="basic-multi-select"
//               classNamePrefix="select"
//             />
//             <Select
//               placeholder="Select an order..."
//               id="long-value-select"
//               instanceId="long-value-select"
//               defaultValue={[]}
//               isMulti
//               onChange={(data) => setOrder(data)}
//               name="muscleGroups"
//               options={data.exercises.map((ex) => {
//                 return {
//                   label: ex.order,
//                 };
//               })}
//               className="basic-multi-select"
//               classNamePrefix="select"
//             />
//             <Select
//               placeholder="Select a priority..."
//               id="long-value-select"
//               instanceId="long-value-select"
//               defaultValue={[]}
//               isMulti
//               onChange={(data) => setPriority(data)}
//               name="muscleGroups"
//               options={data.exercises.map((ex) => {
//                 return {
//                   label: ex.priority,
//                 };
//               })}
//               className="basic-multi-select"
//               classNamePrefix="select"
//             />
//           </div>
//         </div>
//         <div className="mt-4">
//           <button
//             type="button"
//             className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
//             onClick={closeModal}
//           >
//             Add exercise
//           </button>
//         </div>
//       </Modal>
//     </>
//   );
// };

export default AddExerciseToWorkout;
