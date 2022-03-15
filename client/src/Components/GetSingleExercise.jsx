import React, { useState, useEffect } from 'react';
import { DeleteExercise } from './DeleteExercise';
import { useRouter } from 'next/router';
import Button  from '../components/Button';

export const GetSingleExercise = () => {
  const [singleExercise, setSingleExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const id = router.query.id;

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

      <Button href="/">Admin</Button>
    </div>
  );
};
