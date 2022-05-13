import FullPageModal from 'features/modal/FullPageModal';
import React, { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BiX } from 'react-icons/bi';

interface Props {
  order: string;
  name: string;
  sets: string;
  reps: string;
  rir: string;
  rest: string;
  video?: string;
}

export const OverviewRow = ({
  order,
  name,
  sets,
  reps,
  rir,
  rest,
  video,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className="flex py-1 items-center border-solid border-gray-50">
      <div className="bg-slate-800 text-white p-2 rounded-md h-10 w-10 flex justify-center items-center text-md">
        <p>{order}</p>
      </div>

      <div className="px-2 w-full">
        <div>
          <h3
            style={{
              fontSize: '0.87rem',
            }}
          >
            {name}
          </h3>
        </div>

        <ul
          style={{
            fontSize: '0.57rem',
            maxWidth: '250px',
          }}
          className="flex justify-between pt-1 text-slate-600"
        >
          <li className="uppercase">{sets}</li>
          <li className="uppercase">{reps}</li>
          <li className="uppercase">{rir}</li>
          <li className="">{rest}</li>
        </ul>
      </div>
      {!!video && (
        <button className="p-2" onClick={() => setIsOpen(true)}>
          <AiOutlineInfoCircle className="w-6 h-6" />
        </button>
      )}

      <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <button className="p-2" onClick={() => setIsOpen(false)}>
          <BiX className="w-6 h-6" />
        </button>
        {!!video && (
          <div className="pb-5 w-full">
            <video
              controls
              src={`https://cdn.trckd.ca/${video}`}
              className="w-full"
            />
          </div>
        )}
      </FullPageModal>
    </li>
  );
};
