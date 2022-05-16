import React from 'react';
import { useSessionExerciseQuery } from 'features/sessions/useSessionExerciseQuery';
import { SessionExercise } from 'features/sessions/SessionExercise';
import SessionHeader from 'features/sessions/SessionHeader';
import { GetStaticPropsContext } from 'next';
import { CgSpinner } from 'react-icons/cg';

export async function getStaticPaths() {
  arguments;
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const exerciseId = params && params.exerciseId;
  const sessionId = params && params.sessionId;

  return {
    props: { exerciseId, sessionId },
  };
}
interface Props {
  exerciseId: string;
  sessionId: string;
}
const SessionExercisePage = ({ exerciseId, sessionId }: Props) => {
  const { data, isError, isLoading } = useSessionExerciseQuery(
    exerciseId,
    sessionId
  );

  if (isLoading) {
    return (
      <main className="bg-slate-800 min-h-screen py-5">
        <div className="flex justify-center items-center py-10">
          <CgSpinner className="animate-spin text-green-500" size={30} />
        </div>
      </main>
    );
  }

  if (isError) {
    return <main className="bg-slate-800 min-h-screen">Error!</main>;
  }

  if (!data) {
    return (
      <main className="bg-slate-800 min-h-screen">No session exercise</main>
    );
  }

  return (
    <main className="bg-slate-800 min-h-screen">
      <SessionHeader
        sessionId={sessionId}
        exerciseId={exerciseId}
        workoutId={data.exercise.workout_id}
      />
      <SessionExercise
        data={data}
        sessionId={sessionId}
        exerciseId={exerciseId}
      />
    </main>
  );
};

export default SessionExercisePage;
