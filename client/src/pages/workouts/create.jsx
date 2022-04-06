import React, { useState } from 'react';
import { CreateWorkout } from 'features/workouts/CreateWorkout';
import { useExercisesQuery } from 'features/exercises/useExercisesQuery';
import { Input } from 'features/form/Input';
import { GetAllExercises } from 'features/exercises/GetAllExercises';
import { ExerciseList } from 'features/exercises/ExerciseList';
import { Button } from 'features/common/Button';

const CreateWorkoutPage = () => {
  return (
    <div>
      <h1 className="text-3xl p-5">Create Workout</h1>
      <Button href="/workouts">Workouts</Button>
      <Button href="/">Home</Button>
      <CreateWorkout />
    </div>
  );
};

export default CreateWorkoutPage;
