import React from 'react';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import StartSession from 'features/sessions/StartSession';
import { useWorkoutSessionQuery } from './useWorkoutSessionQuery';
import { IoClose } from 'react-icons/io5';
import { CgSpinner } from 'react-icons/cg';

interface Props {
  sessionId: string;
  setIsOpen: (isOpen: boolean) => void;
}

export const OverviewExercises = ({ sessionId, setIsOpen }: Props) => {
  const { data, isError, isLoading } = useWorkoutSessionQuery(sessionId);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full">
        <CgSpinner className="animate-spin text-green-400" size={24} />
      </div>
    );
  }

  if (isError) {
    return <p style={{ color: 'red' }}>fetching error...</p>;
  }

  if (!data) {
    return <p>no data</p>;
  }

  const getLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  return (
    <div className="relative">
      <h1 className="text-lg text-center capitalize">{data.session.name}</h1>
      <button
        className="absolute -top-2 right-0 p-2"
        onClick={() => setIsOpen(false)}
      >
        <IoClose className="w-5 h-5" />
      </button>
      <ul className="pt-2 pb-2 divide-y divide-slate-800">
        {data.session.tasks.map((task, key) => {
          return (
            <li key={task.workout_task_id}>
              {task.exercises.map((exercise, index) => {
                return (
                  <OverviewRow
                    key={exercise.exercise_id}
                    order={`${getLetter(key)}${index + 1}`}
                    name={exercise.name}
                    sets="sets 3"
                    reps="reps 10-12"
                    rir="rir 1"
                    rest="REST 90 seconds"
                    exerciseId={exercise.exercise_id}
                  />
                );
              })}
            </li>
          );
        })}
      </ul>

      <StartSession
        sessionId={sessionId}
        hasStarted={!!data.session.started_at}
        hasEnded={!!data.session.ended_at}
        hasExercises={!data.session.tasks.length}
        taskOrder={data.session.task_order}
      />
    </div>
  );
};
