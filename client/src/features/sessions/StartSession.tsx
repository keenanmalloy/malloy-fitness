import { Button } from 'features/common/Button';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { apiClient } from 'config/axios';
import { GetSessionResponse } from './types';

interface Props {
  sessionId: string;
  hasStarted: boolean;
  hasEnded: boolean;
}

const StartSession = ({ sessionId, hasStarted, hasEnded }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const getSingleWorkout = async (id: string) => {
    const { data } = await apiClient.get<GetSessionResponse>(`/sessions/${id}`);
    return data;
  };

  const initSession = async (id: string) => {
    try {
      const { data } = await apiClient.patch(`/sessions/${id}/start`);
      return data;
    } catch (error) {
      console.log({ error });
    }
  };

  const startOrContinueWorkout = async (sessionId: string) => {
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
      try {
        const { data } = await apiClient(`/sessions/${sessionId}/continue`);
        return router.push(data.url);
      } catch (error) {
        // if error, then redirect to the first exercise in the session instead
        console.log({ error });
        if (!firstExercise) return router.push(`/sessions/${sessionId}/`);
        return router.push(
          `/sessions/${sessionId}/exercises/${firstExercise.exercise_id}`
        );
      }
    }
    const json = await initSession(sessionId);
    if (json.status !== 'success') {
      return;
    }
    queryClient.invalidateQueries('fetchSession');
    if (!firstExercise) return router.push(`/sessions/${sessionId}/`);
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

export default StartSession;
