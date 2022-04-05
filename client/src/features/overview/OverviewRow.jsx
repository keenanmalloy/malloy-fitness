import React from 'react';

export const OverviewRow = ({ order, name, sets, reps, rir, rest }) => {
  return (
    <li className="flex py-1">
      <div className="bg-cyan-700 text-white p-2 rounded-md">{order}</div>
      <div className="px-1 w-full">
        <h3>{name}</h3>
        <ul className="flex justify-between text-xs">
          <li className="uppercase">{sets}</li>
          <li className="uppercase">{reps}</li>
          <li className="uppercase">{rir}</li>
          <li>{rest}</li>
        </ul>
      </div>
    </li>
  );
};
