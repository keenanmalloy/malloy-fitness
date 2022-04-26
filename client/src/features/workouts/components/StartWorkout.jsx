import { Button } from 'features/common/Button';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

const StartWorkout = ({ sessionId, hasStarted, hasEnded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const getSingleWorkout = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/${id}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) throw Error;
    const json = await res.json();
    return json;
  };

  const initSession = async (id) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/${id}/start`,
      {
        method: 'PATCH',
        credentials: 'include',
      }
    );

    if (!response.ok) throw Error;
    const json = await res.json();
    return json;
  };

  const startOrContinueWorkout = async (sessionId) => {
    setIsLoading(true);
    const data = await getSingleWorkout(sessionId);
    if (data.status !== 'success') {
      return;
    }
    const firstExercise = data.session.exercises.sort((a, b) => {
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

    const isStarted = data.session.started_at;
    if (isStarted) {
      return router.push(
        `/sessions/${sessionId}/exercises/${firstExercise.exercise_id}`
      );
    }
    const json = await initSession(sessionId);
    if (json.status !== 'success') {
      return;
    }
    queryClient.invalidateQueries('fetchSession', sessionId);
    router.push(
      `/sessions/${sessionId}/exercises/${firstExercise.exercise_id}`
    );
  };

  if (hasEnded) {
    return null;
  }

  if (hasStarted) {
    return (
      <Button
        className="w-full"
        onClick={() => startOrContinueWorkout(sessionId)}
      >
        {isLoading ? 'Continuing...' : 'Continue'}
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      onClick={() => startOrContinueWorkout(sessionId)}
    >
      {isLoading ? 'Starting...' : 'Start'}
    </Button>
  );
};

export default StartWorkout;
