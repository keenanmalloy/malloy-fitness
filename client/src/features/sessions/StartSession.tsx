import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { apiClient } from 'config/axios';
import { GetSessionResponse } from './types';
import { CgSpinner } from 'react-icons/cg';

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
      <button
        onClick={() => startOrContinueWorkout(sessionId)}
        className={`w-full flex justify-center items-center text-center py-2 px-4 text-sm font-medium bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-1 focus:ring-green-300 focus:text-green-700`}
      >
        {isLoading ? (
          <CgSpinner className="w-6 h-6 animate-spin text-green-500" />
        ) : (
          'Continue Session'
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => startOrContinueWorkout(sessionId)}
      className={`w-full flex justify-center items-center text-center py-2 px-4 text-sm font-medium bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-1 focus:ring-green-300 focus:text-green-700`}
    >
      {isLoading ? (
        <CgSpinner className="w-6 h-6 animate-spin text-green-500" />
      ) : (
        'Start Session'
      )}
    </button>
  );
};

export default StartSession;
