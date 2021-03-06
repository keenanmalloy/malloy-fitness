import { MuscleGroup } from 'features/muscle-groups/types';
import React, { useState } from 'react';
import { ChooseCreateExerciseForm } from './ChooseCreateExerciseForm';
import { CreateCardioExerciseForm } from './CreateCardioExerciseForm';
import { CreateHypertrophyExerciseForm } from './CreateHypertrophyExerciseForm';
import { CreateStrengthExerciseForm } from './CreateStrengthExerciseForm';
import { CreateTherapyExerciseForm } from './CreateTherapyExerciseForm';

interface Props {
  setIsOpen: (type: boolean) => void;
  muscleGroups: MuscleGroup[];
}

export type FormType =
  | 'cardio'
  | 'hypertrophy'
  | 'physiotherapy'
  | 'strength'
  | 'choose';

export const CreateExerciseForms = ({ muscleGroups, setIsOpen }: Props) => {
  const [type, setType] = useState<FormType>('choose');

  const formStates = {
    strength: (
      <CreateStrengthExerciseForm
        muscleGroups={muscleGroups}
        setIsOpen={setIsOpen}
      />
    ),
    hypertrophy: (
      <CreateHypertrophyExerciseForm
        muscleGroups={muscleGroups}
        setIsOpen={setIsOpen}
      />
    ),
    physiotherapy: (
      <CreateTherapyExerciseForm
        muscleGroups={muscleGroups}
        setIsOpen={setIsOpen}
      />
    ),
    cardio: <CreateCardioExerciseForm setIsOpen={setIsOpen} />,
    choose: <ChooseCreateExerciseForm setType={setType} type={type} />,
  };

  return formStates[type];
};
