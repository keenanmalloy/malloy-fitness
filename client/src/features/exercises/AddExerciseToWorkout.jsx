import React from "react";
import { Button } from "features/common/Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Select from "react-select";

// Lets refactor the modal from this file.
// 1. Create a file - features/common/Modal.jsx
// 2. This component should be structured similar to the following
//
// const Modal = ({ isOpen, title, description }) => {
//      return (
//          <Transition appear show={isOpen} as={Fragment}>
//              {/* Guts just past the modal title  */}
//              {children}
//          </Transition>
//      )
// }
//
// Keep in mind the children prop.
// We want to have the contents of the modal dynamic so we can reuse the component.
//

const AddExerciseToWorkout = ({ data }) => {
  console.log({ data });
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Add exercise to workout
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {/* 
                    Whatever text is here should be dynamic. 
                    Think about the modal component just created and the props it expects.
                  */}
                  Payment successful
                </Dialog.Title>
                {/* 
                  Add body of modal as the children of the component.
                  ex. 
                  <Modal>
                    ... rest of the stuff
                  </Modal>

                  What is exercises pointing to within the context of this module? 
                  Think about where exercises is coming from and why uncommenting this
                  snippet below is throwing an error. 

                  *hint* - console.log({ data })
                */}

                {/* <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <Select
                      id="long-value-select"
                      instanceId="long-value-select"
                      defaultValue={[]}
                      isMulti
                      onChange={(data) => setData(data)}
                      name="muscleGroups"
                      options={exercises.map((ex) => {
                        return {
                          label: ex.name,
                          value: ex.exercise_id,
                        };
                      })}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </p>
                </div> */}

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Add exercise
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddExerciseToWorkout;
