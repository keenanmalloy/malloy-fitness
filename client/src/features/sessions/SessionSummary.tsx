import React, {
  ChangeEventHandler,
  FocusEvent,
  useEffect,
  useState,
} from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CgCalendarDates, CgSpinner } from 'react-icons/cg';
import { FaWeightHanging, FaRegTired } from 'react-icons/fa';
import { GiTrafficLightsReadyToGo } from 'react-icons/gi';
import { SessionSummaryResponse } from './types';
import Link from 'next/link';
import { RemoveExerciseFromSession } from './RemoveExerciseFromSession';
import StartSession from './StartSession';
import { ChooseExerciseModal } from './ChooseExerciseModal';
import { useUpdateWorkoutMutation } from 'features/workouts/api/useUpdateWorkoutMutation';

interface Props {
  data: SessionSummaryResponse;
}

export const SessionSummary = ({ data }: Props) => {
  const getLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  const [workoutTitle, setWorkoutTitle] = useState(data.session.name);

  if (!data.session.exercises.length) {
    return (
      <div className="py-1">
        <div className="p-3 text-center">
          <SessionWorkoutTitle
            value={workoutTitle}
            prevValue={data.session.name}
            field={'workout_title'}
            onChange={(e) => setWorkoutTitle(e.target.value)}
            workoutId={data.session.workout_id}
          />
        </div>

        {!data.session.ended_at && (
          <div className="py-5">
            <ChooseExerciseModal data={data} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-1">
      <div className="p-3 text-center">
        <SessionWorkoutTitle
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

      <ul className="flex flex-col divide-y-2 divide-gray-50 px-3 pb-5">
        {data.session.exercise_order &&
          data.session.exercise_order
            .map((exerciseId) =>
              data.session.exercises.find(
                (exercise) => exercise.exercise_id === exerciseId
              )
            )
            .map((exercise, key) => {
              if (!exercise) return null;
              return (
                <li
                  key={exercise.exercise_id}
                  className="flex flex-col justify-between border-solid "
                >
                  <div className="flex justify-between">
                    <div className="border-solid flex-1">
                      <div className="text-left flex">
                        <div className="flex flex-col items-center pt-6">
                          {/* <button className="-mb-1">
                          <IoMdArrowDropup size={30} />
                        </button> */}
                          <div className="flex p-3 rounded-md bg-slate-900 text-white items-center max-h-10 min-h-10 ">
                            <p>{getLetter(key)}1</p>
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
                                    <div className="flex justify-between items-center space-x-2 border-solid py-1 bg-gray-50 px-2 rounded-md mt-1">
                                      <div className="flex flex-col flex-1 pt-1">
                                        <p>Set</p>
                                        <span className="text-xl -mt-2">
                                          0{index + 1}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        {set.weight}lbs
                                      </div>
                                      <div className="flex-1">
                                        {set.repetitions}
                                      </div>
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
                        exerciseId={exercise.exercise_id}
                      />
                    )}
                  </div>
                </li>
              );
            })}
      </ul>

      {!data.session.ended_at && (
        <div className="py-5">
          <ChooseExerciseModal data={data} />
        </div>
      )}
    </div>
  );
};

interface SessionEndStatsProps {
  endedAt: string;
}

const SessionEndStats = ({ endedAt }: SessionEndStatsProps) => {
  if (!endedAt) return null;
  return (
    <>
      <div className="flex items-center flex-col py-5">
        <div className="pb-5">
          <FaWeightHanging size={50} />
        </div>
        <h2>Volume (LBS)</h2>
        <p>0</p>
      </div>
      <div className="flex justify-evenly">
        <span className="flex flex-col">
          EXERCISES
          <p className="flex justify-center">0</p>
        </span>
        <span className="flex flex-col">
          SETS
          <p className="flex ">0</p>
        </span>
        <span className="flex flex-col">
          REPS
          <p className="flex justify-center ">0</p>
        </span>
      </div>
      <div className="flex justify-evenly py-6">
        <span className="flex flex-col items-center">
          <CgCalendarDates size={50} />
          ROTATION
          <p className="flex justify-center">1</p>
        </span>
        <span className="flex flex-col items-center">
          <GiTrafficLightsReadyToGo size={50} />
          READINESS
          <p className="flex ">0/5</p>
        </span>
        <span className="flex flex-col items-center">
          <AiOutlineClockCircle size={50} />
          MINUTES
          <p className="flex justify-center ">0</p>
        </span>
        <span className="flex flex-col items-center">
          <FaRegTired size={50} />
          INTENSITY
          <p className="flex justify-center ">0/10</p>
        </span>
      </div>
    </>
  );
};

interface AccountFieldProps {
  value: string;
  prevValue: string;
  field: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  isTextArea?: boolean;
  placeholder?: string;
  className?: string;
  workoutId: string;
}

const SessionWorkoutTitle = ({
  value,
  field,
  placeholder,
  type,
  onChange,
  prevValue,
  workoutId,
}: AccountFieldProps) => {
  const { mutate, isLoading, isError } = useUpdateWorkoutMutation(workoutId);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value !== prevValue) {
        mutate({
          workout: {
            name: value,
          },
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value, field]);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) =>
    event.target.select();

  return (
    <div className="flex-1 text-2xl relative">
      <input
        onChange={onChange}
        value={value}
        type={type}
        placeholder={placeholder}
        className="text-center"
        onFocus={handleFocus}
      />
      {isLoading && (
        <CgSpinner
          size={28}
          className="animate-spin text-green-500 absolute top-0 right-0"
        />
      )}
      {isError && (
        <div className=" w-full pb-1 text-center">
          <small className="text-red-600 text-xs">
            Error updating workout title
          </small>
        </div>
      )}
    </div>
  );
};
