import Link from 'next/link';
import React from 'react';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { ReadinessData } from './Survey';

export const SurveyFooter = ({
  data,
  firstExerciseId,
  sessionId,
}: {
  data: ReadinessData;
  firstExerciseId: string;
  sessionId: string;
}) => {
  // count not null values in data object
  const count = Object.values(data).filter(Boolean).length;

  return (
    <footer className="w-full">
      <div className="fixed bottom-0 flex justify-between items-center bg-slate-800 text-white right-0 left-0 ">
        <Link href={`/sessions/${sessionId}/`}>
          <button className="p-4">
            <IoMdArrowBack />
          </button>
        </Link>

        <div>Completed {count} / 5</div>

        <Link href={`/sessions/${sessionId}/exercises/${firstExerciseId}`}>
          <button className="p-4 ">
            <IoMdArrowForward />
          </button>
        </Link>
      </div>
    </footer>
  );
};
