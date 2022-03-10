import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeleteExercise } from './DeleteExercise';

export const GetSingleExercise = () => {
  const { id } = useParams();
  const [singleExercise, setSingleExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const routeChange = () => {
    let path = '/exercises';
    navigate(path);
  };
  useEffect(() => {
    fetch(`http://localhost:4000/exercises/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSingleExercise(data.exercise);
        setIsLoading(false);
      });
  }, []);

  const deleteExercise = async (id) => {
    const response = await fetch(`http://localhost:4000/exercises/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      return res.json();
    });

    if (response.status === 'success') {
      setSingleExercise(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleExercise) {
    return <div>No excercise available with id: {id}</div>;
  }

  return (
    <div>
      <div>
        <p>{singleExercise.name}</p>
        <p>{singleExercise.description}</p>
        <p>{singleExercise.movement}</p>
        <p>{singleExercise.range}</p>
        <p>{singleExercise.exercise_id}</p>
      </div>

      <DeleteExercise
        handleClick={() => deleteExercise(singleExercise.exercise_id)}
      />

      <button
        onClick={routeChange}
        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Admin
      </button>
    </div>
  );
};
