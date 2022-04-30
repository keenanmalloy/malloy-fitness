import React from 'react';

export const ChooseCreateExerciseForm = ({ type, setType }) => {
  return (
    <section>
      <CardButton setType={setType} label={'strength'} />
      <CardButton setType={setType} label={'hypertrophy'} />
      <CardButton setType={setType} label={'cardio'} />
      <CardButton setType={setType} label={'physiotherapy'} />
    </section>
  );
};

const CardButton = ({ label, setType }) => {
  return (
    <button
      onClick={() => setType(label)}
      className="bg-gray-50 mt-2 text-gray-800 text-lg py-10 px-4 border border-gray-400 rounded shadow w-full capitalize"
    >
      {label}
    </button>
  );
};
