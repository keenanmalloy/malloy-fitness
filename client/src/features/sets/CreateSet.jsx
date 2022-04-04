import React from 'react';

// GET /workouts/pk/exercises/pk/ gets all exercises for a workout

export const CreateSet = () => {
  fetch('http://localhost:4000/workouts/pk/exercises/pk/', {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
  return <div>CreateSet</div>;
};
