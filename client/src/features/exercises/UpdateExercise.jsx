import React, { useState } from 'react';

export const UpdateExercise = () => {
  const [updateExercise, updateSetExercises] = useState([]);

  const handleClick = async () => {
    const response = await fetch('http://localhost:4000/exercises/9', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'step forward curl',
        description:
          'row that shit',
        category: 'back',
        primary: 'back',
        secondary: 'biceps',
        image: '',
        video: '',
        movement: 'compound',
      }),
    }).then((res) => {
      return res.json();
    });
    updateSetExercises(response.exercise);
  };
  return (
    <>
      <button className='text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900' onClick={handleClick}>
        Update Exercise
      </button>
    </>
  );
};
