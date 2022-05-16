import React from 'react';

interface Props {
  label: string;
}

export const Divider = ({ label }: Props) => {
  return (
    <div className="flex items-center py-1">
      <div className="h-0.5 w-full bg-slate-700" />
      <p className="px-2 font-black">{label}</p>
      <div className="h-0.5 w-full bg-slate-700" />
    </div>
  );
};
