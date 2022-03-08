import React, { useState, useEffect } from 'react';
import { ExerciseList } from './ExerciseList';

export const GetAllExercises = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
   setTimeout(() => {
    fetch('http://localhost:4000/exercises/')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setData(data);
      setIsLoading(false)
    });
   }, 1000);
  }, []);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <ExerciseList data={data} setData={setData}/>
    </div>
  );
};
