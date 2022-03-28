import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';

export const GetSingleExercise = () => {
  const [singleExercise, setSingleExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    console.log('clikjed');
    setIsOpen(true);
  }
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
        console.log(singleExercise);
        setSingleExercise(data.exercise);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [router.isReady]);

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
        <p>{singleExercise.profile}</p>
        <p>{singleExercise.primary.map((group) => group.name)}</p>
        <p>{singleExercise.secondary.map((group) => group.name)}</p>
        <p>{singleExercise.created_by}</p>
        <p>{singleExercise.exercise_id}</p>
      </div>

      <Button onClick={openModal}>Delete exercise</Button>
      <Button href={`/exercises/update/${id}`}>Update exercise</Button>

      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">Are you sure?</h2>
          <p>
            This exercise will be removed from your workout. This action is
            permanent.
          </p>
          <div className="flex flex-col">
            <Button
              className="mt-4"
              onClick={() => deleteExercise(singleExercise.exercise_id)}
            >
              Delete
            </Button>
            <Button className="mt-4" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
