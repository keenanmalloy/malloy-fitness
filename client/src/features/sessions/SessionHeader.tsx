import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useSessionQuery } from 'features/sessions/useSessionQuery';
import { RiTimerFill } from 'react-icons/ri';
import SessionTimer from 'features/sessions/SessionTimer';
import { useRouter } from 'next/router';
import { RotateExercise } from './RotateExercise';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import { ChangeExercise } from './ChangeExercise';

interface Props {
  sessionId: string;
  exerciseId: string;
  workoutId: string;
}

const SessionHeader = ({ sessionId, exerciseId, workoutId }: Props) => {
  const router = useRouter();
  const { data, isError, isLoading } = useSessionQuery(sessionId, exerciseId);

  if (isLoading) {
    return <div className="pt-1"></div>;
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data) {
    return <p>none available...</p>;
  }

  const currentExercise = data.session.exercises.find(
    (ex) => ex.exercise_id === exerciseId
  );

  const getLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  const currentExerciseIndex = data.session.exercise_order.findIndex(
    (id: string) => id === exerciseId
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900 text-white z-10 flex flex-col items-center">
      <section className="flex justify-betweenmax-w-md w-full">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => router.push(`/sessions/${sessionId}`)}
            className="py-4"
          >
            <BiArrowBack className="w-10 h-4" />
          </button>

          <h2 className="capitalize overflow-clip text-ellipsis text-sm">
            {data.session.name}
          </h2>

          <div className="flex px-2 relative flex-1 items-center justify-end">
            <div className="absolute right-5 flex items-center">
              <RiTimerFill size={18} />
              <SessionTimer
                endedAt={data.session.ended_at}
                startedAt={data.session.started_at}
                workoutId={''}
              />
            </div>
          </div>
        </div>

        <div className="flex">
          <ChangeExercise
            exercises={data.session.exercises}
            exerciseId={exerciseId}
            sessionId={sessionId}
            workoutId={workoutId}
          />
          <RotateExercise
            exerciseId={exerciseId}
            sessionId={sessionId}
            workoutId={workoutId}
          />
        </div>
      </section>
      <div className="px-1 pt-0.5 border-solid border-slate-700 border-t w-full max-w-md">
        <OverviewRow
          order={`${getLetter(currentExerciseIndex)}1`}
          name={currentExercise?.name ?? ''}
          sets="sets 3"
          reps="reps 10-12"
          rir="rir 1"
          rest="REST 90 seconds"
          exerciseId={currentExercise?.exercise_id ?? ''}
        />
      </div>
    </header>
  );
};

export default SessionHeader;
