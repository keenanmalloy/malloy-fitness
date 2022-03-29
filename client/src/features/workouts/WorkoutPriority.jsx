import React from 'react';

const WorkoutPriority = ({ exercise, workoutId }) => {
  const incrementPriority = () => {
    fetch(
      `http://localhost:4000/workouts/${workoutId}/exercises/${exercise.exercise_id}/`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: exercise.priority + 1,
        }),
      }
    ).then((res) => {
      return res.json();
    });
  };

  const decrementPriority = () => {
    fetch(
      `http://localhost:4000/workouts/${workoutId}/exercises/${exercise.exercise_id}/`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: exercise.priority - 1,
        }),
      }
    ).then((res) => {
      return res.json();
    });
  };
  return (
    <div>
      <button onClick={incrementPriority}>Priority Up</button>
      <button onClick={decrementPriority}>Priority Down</button>
    </div>
  );
};

export default WorkoutPriority;
