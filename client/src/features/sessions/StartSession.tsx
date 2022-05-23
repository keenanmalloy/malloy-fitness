import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { apiClient } from 'config/axios';
import { CgSpinner } from 'react-icons/cg';
import Link from 'next/link';

interface Props {
  sessionId: string;
  hasStarted: boolean;
  hasEnded: boolean;
  hasExercises?: boolean;
  taskOrder: string[];
}

const StartSession = ({
  sessionId,
  hasStarted,
  hasEnded,
  hasExercises,
  taskOrder,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

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

    const firstTaskId = taskOrder[0];

    if (hasStarted) {
      try {
        const { data } = await apiClient(`/sessions/${sessionId}/continue`);
        return router.push(data.url);
      } catch (error) {
        // if error, then redirect to the first exercise in the session instead
        console.log({ error });
        if (!firstTaskId) return router.push(`/sessions/${sessionId}/`);
        return router.push(`/sessions/${sessionId}/tasks/${firstTaskId}`);
      }
    }
    const json = await initSession(sessionId);
    if (json.status !== 'success') {
      return;
    }
    queryClient.invalidateQueries('fetchSession');
    if (!firstTaskId) return router.push(`/sessions/${sessionId}/`);
    router.push(`/sessions/${sessionId}/start`);
  };

  if (hasEnded || hasExercises) {
    return (
      <Link href={`/sessions/${sessionId}`}>
        <button
          className={`w-full flex justify-center items-center text-center py-2 px-4 text-sm font-medium  rounded-md border border-slate-700 focus:z-10 focus:ring-2 focus:ring-slate-600`}
        >
          {isLoading ? (
            <CgSpinner className="w-6 h-6 animate-spin text-green-500" />
          ) : (
            <>{hasEnded ? 'View Session' : 'Build Session'}</>
          )}
        </button>
      </Link>
    );
  }

  return (
    <button
      onClick={() => startOrContinueWorkout(sessionId)}
      className={`w-full flex justify-center items-center text-center py-2 px-4 text-sm font-medium  rounded-md border border-slate-700 focus:z-10 focus:ring-2 focus:ring-slate-600`}
    >
      {isLoading ? (
        <CgSpinner className="w-6 h-6 animate-spin text-green-500" />
      ) : (
        <>{hasStarted ? 'Continue Session' : 'Start Session'}</>
      )}
    </button>
  );
};

export default StartSession;
