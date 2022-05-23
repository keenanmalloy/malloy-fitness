import React from 'react';
import { useSessionExerciseQuery } from 'features/sessions/useSessionExerciseQuery';
import { SessionExercise } from 'features/sessions/SessionExercise';
import SessionHeader from 'features/sessions/SessionHeader';
import { GetStaticPropsContext } from 'next';
import { CgSpinner } from 'react-icons/cg';
import { SessionFooter } from 'features/sessions/SessionFooter';

export async function getStaticPaths() {
  arguments;
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const workoutTaskId = params && params.workoutTaskId;
  const sessionId = params && params.sessionId;

  return {
    props: { workoutTaskId, sessionId },
  };
}
interface Props {
  workoutTaskId: string;
  sessionId: string;
}
const SessionExercisePage = ({ workoutTaskId, sessionId }: Props) => {
  const { data, isError, isLoading } = useSessionExerciseQuery(
    workoutTaskId,
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
        workoutTaskId={workoutTaskId}
        workoutId={data.task[0].workout_id}
      />

      {data.task.map((exercise, index) => {
        return (
          <SessionExercise
            key={exercise.workout_task_exercise_id}
            data={exercise}
            sessionId={sessionId}
            workoutTaskId={workoutTaskId}
            number={index + 1}
            exerciseIds={data.exerciseIds}
          />
        );
      })}

      <div className="h-16" />

      <SessionFooter
        nextEx={data.next}
        prevEx={data.prev}
        sessionId={sessionId}
      />
    </main>
  );
};

export default SessionExercisePage;
