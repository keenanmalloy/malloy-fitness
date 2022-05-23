import { GetSingleExercise } from 'features/exercises/components/GetSingleExercise';
import FullPageModal from 'features/modal/FullPageModal';
import React, { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { IoMdInformationCircle } from 'react-icons/io';

interface Props {
  order: string;
  name: string;
  sets: string;
  reps: string;
  rir: string;
  rest: string;
  video?: string;
  exerciseId: string;
}

export const OverviewRow = ({
  order,
  name,
  sets,
  reps,
  rir,
  rest,
  video,
  exerciseId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button
      className="flex py-1 items-center border-solid border-gray-50 text-left"
      onClick={() => setIsOpen(true)}
    >
      <div className="bg-slate-800 text-white p-2 rounded-md h-10 w-10 flex justify-center items-center text-md">
        <p>{order}</p>
      </div>

      <div className="px-2 w-full text-base flex-1">
        <div style={{ lineHeight: '1.2rem' }} className="overflow-hidden">
          {name}
          <span className="px-1 text-slate-400 inline-block">
            <IoMdInformationCircle size={14} />
          </span>
        </div>
        <ul
          style={{
            fontSize: '0.6rem',
          }}
          className="flex space-x-2 uppercase -mt-1 text-slate-400 truncate"
        >
          <small>{sets}</small>
          <small>{reps}</small>
          <small>{rir}</small>
          <small>90 Secs</small>
        </ul>
      </div>

      <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <button className="p-2" onClick={() => setIsOpen(false)}>
          <BiX className="w-6 h-6" />
        </button>

        <GetSingleExercise id={exerciseId} />
      </FullPageModal>
    </button>
  );
};
