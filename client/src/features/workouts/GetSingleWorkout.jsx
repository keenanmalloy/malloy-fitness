import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "features/common/Button";
import AddExerciseToWorkout from "features/exercises/AddExerciseToWorkout";

export const GetSingleWorkout = () => {
  const [singleWorkout, setSingleWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) return;
    fetch(`http://localhost:4000/workouts/${id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw Error("Couldnt fetch workout");
        }
        return res.json();
      })
      .then((data) => {
        setSingleWorkout(data.workout);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [router.isReady]);

  const deleteWorkout = async (id) => {
    const response = await fetch(`http://localhost:4000/workouts/${id}`, {
      method: "DELETE",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      return res.json();
    });

    if (response.status === "success") {
      setSingleWorkout(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleWorkout) {
    return <div>No workout available with id: {id}</div>;
  }

  return (
    <div>
      <div>
        <h1>{singleWorkout.name}</h1>
        <p>{singleWorkout.workout_id}</p>

        {/* 
          Lets make the below snippet into its own component.
          Call it <WorkoutExercises />

          It should accept an array of exercises
          const WorkoutExercises = ({ exercises }) => {}

          When bringing the component <WorkoutExercises exercises={... something goes here ...} /> into this component, 
          think about what should be passed as exercises. What exactly do you map over below?

          In this new WorkoutExercises component, 
          
          - handle if there are no exercises. 
          - sort the exercises by "order". *hint* use the .sort array method.

          Then:

          1. Add 2 buttons to *each* exercise to increment & decrement the order of the exercise.
            a) Add onClick handler functions to both buttons
            b) Display the {order} of each exercise

          2. Add 2 buttons to *each* exercise to increment & decrement the priority of the exercise.
            a) Add onClick handler functions to both buttons
            b) Display the {priority} of each exercise

          The onClick on each button will make a request to:
          PUT /workouts/:pk/exercises/:pk/  

          With a body of: 
          {
            "order": "[number]",

            OR 

            "priority": "[number]",
          }

          If the call is successful, we'll need a way to "refetch" the workout or update the state of exercises.
          We can do this 2 ways.

          1. Refetch the workout in the useEffect hook. *ideal solution*

          - Perhaps we can think about bringing in "react-query" to handle this logic for us. 
          If you want to handle it yourself you can try to add state to the <GetSingleWorkout /> component and pass the state to <WorkoutExercises /> 
          so that whenever a fetch is successful, we can call a rerender of the component. Up to you. 

          2. Handle this in state *not ideal*

          - Putting the list of exercises in state and manually updating that state by filtering out the exericise being changed, and replacing it with the 
          exercise that has the updated order / priority. 

        */}
        {singleWorkout.exercises.map((ex) => {
          return (
            <div key={ex.exercise_id}>{`${ex.exercise_id}  ${ex.name}`}</div>
          );
        })}
      </div>

      {/* 
        Before we delete a workout, lets use that modal component as a confirmation panel. 
        Clicking on this button below should open the modal. In the modal should be the logic
        to make the DELETE request to the database. 
      */}
      <Button handleClick={() => deleteWorkout(singleWorkout.workout_id)}>
        Delete workout
      </Button>
      <AddExerciseToWorkout data={singleWorkout} />
    </div>
  );
};
