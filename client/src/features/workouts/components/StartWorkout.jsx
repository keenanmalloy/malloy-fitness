import { Button } from 'features/common/Button';
import React from 'react';
import { useRouter } from 'next/router';

const StartWorkout = ({ workoutId }) => {
  const router = useRouter();
  const getSingleWorkout = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}`,
      {
        credentials: 'include',
      }
    );
    const json = await res.json();
    return json;
  };

  const initializeWorkout = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/workouts/${id}/start`,
      {
        method: 'PATCH',
        credentials: 'include',
      }
    );
    const json = await res.json();
    return json;
  };

  const startWorkout = async (workoutId) => {
    const workoutRes = await getSingleWorkout(workoutId);
    if (workoutRes.status !== 'success') {
      return;
    }
    const firstExercise = workoutRes.workout.exercises.sort((a, b) => {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      return 0;
    })[0];

    const isStarted = workoutRes.workout.started_at;
    if (isStarted) {
      return router.push(
        `/workouts/${workoutId}/exercises/${firstExercise.exercise_id}`
      );
    }
    const json = await initializeWorkout(workoutId);
    if (json.status !== 'success') {
      return;
    }
    router.push(
      `/workouts/${workoutId}/exercises/${firstExercise.exercise_id}`
    );
  };
  return (
    <Button onClick={() => startWorkout(workoutId)} className="w-full">
      Start Workout
    </Button>
  );
};

export default StartWorkout;
