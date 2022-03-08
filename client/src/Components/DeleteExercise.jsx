import React, { useState } from 'react';

export const DeleteExercise = ({ id, exercises, setData }) => {
  console.log({ id, exercises, setData });
  const handleClick = async () => {
    const response = await fetch(`http://localhost:4000/exercises/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      return res.json();
    });
    console.log({ response });
    const filteredEx = exercises.filter((exercise) => {
      return exercise.exercise_id !== id;
    });

    setData(filteredEx);
    // console.log(filteredEx, id);
  };
  return (
    <>
      <button
        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={handleClick}
      >
        Delete Exercise
      </button>
    </>
  );
};
