import React from 'react';
import { useSessionExerciseQuery } from 'features/sessions/useSessionExerciseQuery';
import { SessionExercise } from 'features/sessions/SessionExercise';
import SessionHeader from 'features/sessions/SessionHeader';
import { Skeleton } from 'features/common/Skeleton';
import { GetStaticPropsContext } from 'next';

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
        <Skeleton className="h-20 w-full mt-7" />
        <Skeleton className="h-44 w-full mt-1" />
        <Skeleton className="h-28 w-full mt-10" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24 mt-8 mr-4 rounded-md" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-full mt-8 mx-4 rounded-md" />
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
