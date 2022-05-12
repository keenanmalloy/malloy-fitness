import FullPageModal from 'features/modal/FullPageModal';
import React, { useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { CgCalendarDates } from 'react-icons/cg';
import {
  FaWeightHanging,
  FaRegTired,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { GiTrafficLightsReadyToGo } from 'react-icons/gi';
import { SessionSummaryResponse } from './types';
import Image from 'next/image';
import { BiX } from 'react-icons/bi';
import { SelectableExerciseList } from './SelectableExercistList';
import { CreateExercise } from 'features/exercises/components/CreateExercise';
import { FilterExercises } from 'features/exercises/components/FilterExercises';
import { Input } from 'features/form/Input';
import { useAddExerciseToSessionMutation } from './useAddExerciseToSession';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RemoveExerciseFromSession } from './RemoveExerciseFromSession';
import StartSession from './StartSession';
import { ChooseExerciseModal } from './ChooseExerciseModal';

interface Props {
  data: SessionSummaryResponse;
}

export const SessionSummary = ({ data }: Props) => {
  const getLetter = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index];
  };

  return (
    <div className="py-1">
      <div className="p-3 text-center">
        <h1 className="text-2xl">{data.session.name}</h1>
      </div>

      <SessionEndStats endedAt={data.session.ended_at} />
      <div className="px-5 w-full">
        <StartSession
          sessionId={data.session.session_id}
          hasStarted={!!data.session.started_at}
          hasEnded={!!data.session.ended_at}
        />
      </div>

      <ul className="flex flex-col divide-y-2 divide-gray-50 px-3">
        {data.session.exercises.map((exercise, key) => (
          <li
            key={exercise.exercise_id}
            className="flex justify-between border-solid "
          >
            <Link
              href={`/sessions/${data.session.session_id}/exercises/${exercise.exercise_id}`}
            >
              <button className="border-solid py-6 flex-1" onClick={() => {}}>
                <div className="text-left flex">
                  <div className="flex p-3 rounded-md bg-slate-900 text-white items-center max-h-10 min-h-10 mr-3">
                    <p>{getLetter(key)}1</p>
                  </div>
                  <div>
                    <h3 className="text-lg">{exercise.name}</h3>
                    <span className="text-sm text-green-500">
                      {exercise.sets.length}{' '}
                      {exercise.sets.length > 1 ? 'sets' : 'set'}
                    </span>
                  </div>
                </div>
              </button>
            </Link>

            <RemoveExerciseFromSession
              data={data}
              exerciseId={exercise.exercise_id}
            />
          </li>
        ))}
      </ul>
      <ChooseExerciseModal data={data} />
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

interface SessionOverviewProps {
  data: SessionSummaryResponse;
}

const SessionOverview = ({ data }: SessionOverviewProps) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Session Overview</h1>
      {data.session.exercises.map((ex) => {
        return (
          <div className="flex flex-col">
            <div className="mb-5 w-full aspect-video relative">
              <Image
                src={`https://thumbnails.trckd.ca/${ex.video}-0.jpg`}
                layout="fill"
                className="-z-10"
              />
            </div>
            <p>{ex.name}</p>
            <section className="py-5">
              <header className="flex justify-between">
                <div className="flex-1"></div>
                <div className="flex-1">Reps</div>
                <div className="flex-1">Weight (LBS)</div>
              </header>
              <main>
                {ex.sets.map((set, index) => {
                  return (
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col flex-1">
                        Set <span>0{index + 1}</span>
                      </div>
                      <div className="flex-1">{set.repetitions}</div>
                      <div className="flex-1">{set.weight}</div>
                    </div>
                  );
                })}
              </main>
            </section>
          </div>
        );
      })}
    </div>
  );
};
