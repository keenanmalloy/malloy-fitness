import { Button } from 'features/common/Button';
import React from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

const StartWorkout = ({ workoutId, hasStarted, hasEnded }) => {
  const queryClient = useQueryClient();
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
    queryClient.invalidateQueries('fetchWorkout', workoutId);
    router.push(
      `/workouts/${workoutId}/exercises/${firstExercise.exercise_id}`
    );
  };

  if (hasEnded) {
    return null;
  }
  return (
    <div>
      <Button className="w-full" onClick={() => startWorkout(workoutId)}>
        {hasStarted ? 'Continue Workout' : 'Start Workout'}
      </Button>
    </div>
  );
};

export default StartWorkout;
