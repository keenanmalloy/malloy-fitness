import React from 'react';

interface Props {
  label: string;
}

export const Divider = ({ label }: Props) => {
  return (
    <div className="flex items-center py-3">
      <div className="h-0.5 w-full bg-gray-100" />
      <p className="px-2 font-black">{label}</p>
      <div className="h-0.5 w-full bg-gray-100" />
    </div>
  );
};
