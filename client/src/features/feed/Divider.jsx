import React from 'react';

export const Divider = ({ label }) => {
  return (
    <div className="flex items-center py-5">
      <div className="h-0.5 w-full bg-gray-100" />
      <p className="px-2 font-black">{label}</p>
      <div className="h-0.5 w-full bg-gray-100" />
    </div>
  );
};
