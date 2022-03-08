import React, { useState } from 'react';

export const CreateExercise = () => {
  const [createExercise, createSetExercises] = useState([]);

  const handleClick = async () => {
    const response = await fetch('http://localhost:4000/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'barbell row',
        description:
          'row that shit',
        category: 'back',
        primary: [1],
        secondary: [1],
        image: '',
        video: '',
        movement: 'compound',
      }),
    }).then((res) => {
      return res.json();
    });
    console.log(response)
    createSetExercises(response.exercises);
  };
  return (
    <>
      <button className='text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' onClick={handleClick}>
        Create Exercise
      </button>
    </>
  );
};
