import React from 'react';
import { useSessionExerciseQuery } from 'features/sessions/useSessionExerciseQuery';
import { SessionExercise } from 'features/sessions/SessionExercise';
import SessionHeader from 'features/sessions/SessionHeader';
import { Skeleton } from 'features/common/Skeleton';
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
      <div className="py-5">
        <Skeleton className="h-14 w-full mt-7" />
        <div className="flex justify-center items-center py-10">
          <CgSpinner className="animate-spin text-green-500" size={30} />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error!</div>;
  }

  if (!data) {
    return <div>No session exercise</div>;
  }

  return (
    <>
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
    </>
  );
};

export default SessionExercisePage;
