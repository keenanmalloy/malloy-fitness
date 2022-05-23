import React from 'react';
import { GetExerciseSets } from 'features/sets/components/GetExerciseSets';
import { Notes } from './Notes';
import { GetSessionExerciseResponse } from './types';
import { SessionFooter } from './SessionFooter';
import { TaskSchema } from './useSessionExerciseQuery';
import { OverviewRow } from 'features/workout-overview/OverviewRow';
import { ChangeExercise } from './ChangeExercise';
import { RotateExercise } from './RotateExercise';

interface Props {
  sessionId: string;
  workoutTaskId: string;
  data: TaskSchema['task'][0];
  number: number;
  exerciseIds: string[];
}

export const SessionExercise = ({
  sessionId,
  workoutTaskId,
  data,
  exerciseIds,
  number,
}: Props) => {
  const getLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  const currentTaskIndex = data.task_order.findIndex(
    (id: string) => id === workoutTaskId
  );

  return (
    <main className="pt-12">
      <div className="flex justify-end w-full bg-slate-900 text-white pt-0.5 border-solid border-slate-700 border-t "></div>
      <div className="px-1 pt-0.5 w-full max-w-md bg-slate-900 text-white flex justify-between">
        <OverviewRow
          order={`${getLetter(currentTaskIndex)}${number}`}
          name={data.name ?? ''}
          sets="sets 3"
          reps="reps 10-12"
          rir="rir 1"
          rest="REST 90 seconds"
          exerciseId={data.exercise_id ?? ''}
        />
        <div className="flex">
          <ChangeExercise
            exerciseId={data.exercise_id}
            sessionId={sessionId}
            workoutId={data.workout_id}
            exerciseIds={exerciseIds}
            workoutTaskId={workoutTaskId}
            currentWorkoutTaskExerciseId={data.workout_task_exercise_id}
          />
          <RotateExercise
            exerciseId={data.exercise_id}
            sessionId={sessionId}
            workoutId={data.workout_id}
            workoutTaskId={workoutTaskId}
            workoutTaskExerciseId={data.workout_task_exercise_id}
          />
        </div>
      </div>

      <GetExerciseSets
        sessionId={sessionId}
        exerciseId={data.exercise_id}
        record={[]}
      />
      {/* 
      <Notes
        exercise={...data}
        exNotes={data.exercise.notes}
        exerciseId={exerciseId}
        workoutId={data.exercise.workout_id}
      /> */}
    </main>
  );
};
