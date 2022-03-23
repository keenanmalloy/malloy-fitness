import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "features/common/Button";

export const GetSingleExercise = () => {
  const [singleExercise, setSingleExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const id = router.query.id;

  useEffect(() => {
    fetch(`http://localhost:4000/exercises/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw Error("couldnt fetch exercise");
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
  }, []);

  const deleteExercise = async (id) => {
    const response = await fetch(`http://localhost:4000/exercises/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      return res.json();
    });

    if (response.status === "success") {
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

      <Button handleClick={() => deleteExercise(singleExercise.exercise_id)}>
        Delete exercise
      </Button>

      <Button href="/">Admin</Button>
    </div>
  );
};
