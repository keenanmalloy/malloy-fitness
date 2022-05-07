import React from 'react';

interface Props {
  order: number;
  name: string;
  sets: string;
  reps: string;
  rir: string;
  rest: string;
}

export const OverviewRow = ({ order, name, sets, reps, rir, rest }: Props) => {
  return (
    <li className="flex py-1 items-center border-solid border-gray-50">
      <div className="bg-cyan-700 text-white p-2 rounded-md h-10 w-10 flex justify-center items-center text-md">
        <p>{order}</p>
      </div>

      <div className="px-1 w-full">
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
            fontSize: '0.67rem',
            maxWidth: '250px',
          }}
          className="flex justify-between pt-0.5"
        >
          <li className="uppercase">{sets}</li>
          <li className="uppercase">{reps}</li>
          <li className="uppercase">{rir}</li>
          <li className="">{rest}</li>
        </ul>
      </div>
    </li>
  );
};
