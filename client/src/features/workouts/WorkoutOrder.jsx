import React from 'react';

const WorkoutOrder = ({ exercise, workoutId }) => {
  console.log({ exercise, workoutId });
  const incrementOrder = () => {
    fetch(
      `http://localhost:4000/workouts/${workoutId}/exercises/${exercise.exercise_id}/`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: exercise.order + 1,
        }),
      }
    ).then((res) => {
      return res.json();
    });
  };

  const decrementOrder = () => {
    fetch(
      `http://localhost:4000/workouts/${workoutId}/exercises/${exercise.exercise_id}/`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: exercise.order - 1,
        }),
      }
    ).then((res) => {
      return res.json();
    });
  };
  return (
    <div>
      <button onClick={incrementOrder}>Order Up</button>
      <button onClick={decrementOrder}>Order Down</button>
    </div>
  );
};

export default WorkoutOrder;
