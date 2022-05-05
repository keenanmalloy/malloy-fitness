import React from 'react';
import { useSessionExerciseQuery } from 'features/sessions/useSessionExerciseQuery';
import { SessionExercise } from 'features/sessions/SessionExercise';
import SessionHeader from 'features/sessions/SessionHeader';
import { Skeleton } from 'features/common/Skeleton';

export async function getStaticPaths() {
  arguments;
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const exerciseId = params && params.exerciseId;
  const sessionId = params && params.sessionId;

  return {
    props: { exerciseId, sessionId },
  };
}

const SessionExercisePage = ({ exerciseId, sessionId }) => {
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

  return (
    <>
      <SessionHeader
        sessionId={sessionId}
        exerciseId={exerciseId}
        workoutId={data.exercise.workout_id}
      />
      <SessionExercise
        exercise={data.exercise}
        prevEx={data.prev}
        nextEx={data.next}
        sessionId={sessionId}
        exerciseId={exerciseId}
        record={data.record}
      />
    </>
  );
};

export default SessionExercisePage;
