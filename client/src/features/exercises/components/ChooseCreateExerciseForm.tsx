import React from 'react';

interface Props {
  setType: (type: string) => void;
  type: string;
}

export const ChooseCreateExerciseForm = ({ type, setType }: Props) => {
  return (
    <section>
      <CardButton setType={setType} label={'strength'} />
      <CardButton setType={setType} label={'hypertrophy'} />
      <CardButton setType={setType} label={'cardio'} />
      <CardButton setType={setType} label={'physiotherapy'} />
    </section>
  );
};

interface CardButtonProps {
  label: string;
  setType: (type: string) => void;
}

const CardButton = ({ label, setType }: CardButtonProps) => {
  return (
    <button
      onClick={() => setType(label)}
      className="bg-gray-50 mt-2 text-gray-800 text-lg py-10 px-4 border border-gray-400 rounded shadow w-full capitalize"
    >
      {label}
    </button>
  );
};
