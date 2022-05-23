import React from 'react';
import { FormType } from './CreateExerciseForms';

interface Props {
  setType: (type: FormType) => void;
  type: FormType;
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
  label: FormType;
  setType: (type: FormType) => void;
}

const CardButton = ({ label, setType }: CardButtonProps) => {
  return (
    <button
      onClick={() => setType(label)}
      className="bg-slate-800 mt-2 text-white text-lg py-10 px-4 rounded shadow w-full capitalize"
    >
      {label}
    </button>
  );
};
