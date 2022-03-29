import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'features/common/Button';
import { DeleteExercise } from './DeleteExercise';

export const GetSingleExercise = () => {
  const [singleExercise, setSingleExercise] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const id = router.query.id;

  useEffect(() => {
    if (!router.isReady) return;
    fetch(`http://localhost:4000/exercises/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          throw Error('couldnt fetch exercise');
        }
        return res.json();
      })
      .then((data) => {
        setSingleExercise(data.exercise);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [router.isReady]);

  if (error) {
    return <div>No exercise available with id: {id}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <p>{singleExercise.name}</p>
        <p>{singleExercise.description}</p>
        <p>{singleExercise.profile}</p>
        <p>{singleExercise.primary.map((group) => group.name)}</p>
        <p>{singleExercise.secondary.map((group) => group.name)}</p>
        <p>{singleExercise.created_by}</p>
        <p>{singleExercise.exercise_id}</p>
      </div>

      <Button href={`/exercises/update/${id}`}>Update exercise</Button>
      <DeleteExercise exerciseId={singleExercise.exercise_id} />
    </div>
  );
};
