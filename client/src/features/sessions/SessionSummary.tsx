import React, { useState } from 'react';
import Link from 'next/link';
import { RemoveExerciseFromSession } from './RemoveExerciseFromSession';
import StartSession from './StartSession';
import { ChooseExerciseModal } from './ChooseExerciseModal';
import { SessionSchema } from './useSessionSummaryQuery';
import { SessionEndStats } from './SessionEndStats';
import { EditableSessionWorkoutTitle } from './EditableSessionWorkoutTitle';

interface Props {
  data: SessionSchema;
}

export const SessionSummary = ({ data }: Props) => {
  const getLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  const [workoutTitle, setWorkoutTitle] = useState(data.session.name);

  if (!data.session.tasks.length) {
    return (
      <main>
        <div className="p-3 text-center">
          <EditableSessionWorkoutTitle
            value={workoutTitle}
            prevValue={data.session.name}
            field={'workout_title'}
            onChange={(e) => setWorkoutTitle(e.target.value)}
            workoutId={data.session.workout_id}
          />
        </div>

        {!data.session.ended_at && (
          <div className="p-5 text-white">
            <ChooseExerciseModal data={data} isMultiSelectable />
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="py-1 bg-slate-900 min-h-screen text-white">
      <div className="p-3 text-center">
        <EditableSessionWorkoutTitle
          value={workoutTitle}
          prevValue={data.session.name}
          field={'workout_title'}
          onChange={(e) => setWorkoutTitle(e.target.value)}
          workoutId={data.session.workout_id}
        />
      </div>

      <SessionEndStats endedAt={data.session.ended_at} />
      <div className="px-5 w-full">
        <StartSession
          sessionId={data.session.session_id}
          hasStarted={!!data.session.started_at}
          hasEnded={!!data.session.ended_at}
        />
      </div>

      <ul className="flex flex-col divide-y-2 divide-slate-700 px-3 pb-5">
        {data.session.tasks.map((task, key) => {
          if (!task) return null;

          return (
            <li
              className="flex flex-col justify-between border-solid "
              key={task.workout_task_id}
            >
              {task.exercises.map((exercise, index) => {
                return (
                  <div
                    className="flex justify-between"
                    key={exercise.workout_task_exercise_id}
                  >
                    <div className="border-solid flex-1">
                      <div className="text-left flex">
                        <div className="flex flex-col items-center pt-6">
                          {/* <button className="-mb-1">
                          <IoMdArrowDropup size={30} />
                        </button> */}
                          <div className="flex p-3 rounded-md bg-slate-800 text-white items-center max-h-10 min-h-10 ">
                            <p>
                              {getLetter(key)}
                              {index + 1}
                            </p>
                          </div>
                          {/* <button className="-mt-1">
                          <IoMdArrowDropdown size={30} />
                        </button> */}
                        </div>

                        <div className="ml-2 w-full h-full pt-5 pb-2 flex flex-col">
                          {!data.session.started_at ? (
                            <>
                              <h3 className="text-lg">{exercise.name}</h3>
                              <span className="text-sm text-green-500">
                                {exercise.sets.length}{' '}
                                {exercise.sets.length > 1 ||
                                exercise.sets.length === 0
                                  ? 'sets'
                                  : 'set'}
                              </span>
                            </>
                          ) : (
                            <Link
                              href={`/sessions/${data.session.session_id}/exercises/${exercise.exercise_id}`}
                            >
                              <a className="w-full">
                                <h3 className="text-lg">{exercise.name}</h3>
                                <span className="text-sm text-green-500">
                                  {exercise.sets.length}{' '}
                                  {exercise.sets.length > 1 ||
                                  exercise.sets.length === 0
                                    ? 'sets'
                                    : 'set'}
                                </span>
                              </a>
                            </Link>
                          )}

                          {!!exercise.sets.length && (
                            <section className="py-1">
                              <header className="flex justify-between text-xs">
                                <div className="flex-1"></div>
                                <div className="flex-1">Weight</div>
                                <div className="flex-1">Reps</div>
                              </header>
                              <main className="flex flex-col divide-y-2 divide-green-50">
                                {exercise.sets.map((set, index) => {
                                  return (
                                    <div className="flex justify-between items-center space-x-2 py-1 bg-slate-700 px-2 rounded-md mt-1">
                                      <div className="flex flex-col flex-1 pt-1">
                                        <p>Set</p>
                                        <span className="text-xl -mt-2">
                                          0{index + 1}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        {set.weight}lbs
                                      </div>
                                      <div className="flex-1">{set.reps}</div>
                                    </div>
                                  );
                                })}
                              </main>
                            </section>
                          )}
                        </div>
                      </div>
                    </div>
                    {!data.session.ended_at && (
                      <RemoveExerciseFromSession
                        data={data}
                        workoutTaskId={exercise.workout_task_id}
                        exerciseId={exercise.exercise_id}
                        taskExerciseId={exercise.workout_task_exercise_id}
                        isSuperset={task.exercises.length > 1}
                      />
                    )}
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>

      {!data.session.ended_at && (
        <div className="p-5">
          <ChooseExerciseModal data={data} isMultiSelectable />
        </div>
      )}
    </main>
  );
};
