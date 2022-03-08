import React, { useState } from 'react';

export const GetSingleExercise = ({ id }) => {
  const [singleExercise, setSingleExercise] = useState(null);

  const handleClick = async () => {
    const response = await fetch(`http://localhost:4000/exercises/${id}`).then((res) => {
      return res.json();
    });
    setSingleExercise(response.exercise);
  };

  return (
    <>
      <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' onClick={handleClick}>Return exercise</button>
    </>
  );
};
