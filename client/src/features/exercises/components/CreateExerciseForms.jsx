import React, { useState } from 'react';
import { ChooseCreateExerciseForm } from './ChooseCreateExerciseForm';
import { CreateCardioExerciseForm } from './CreateCardioExerciseForm';
import { CreateHypertrophyExerciseForm } from './CreateHypertrophyExerciseForm';
import { CreateStrengthExerciseForm } from './CreateStrengthExerciseForm';
import { CreateTherapyExerciseForm } from './CreateTherapyExerciseForm';

export const CreateExerciseForms = ({ muscleGroups, setIsOpen }) => {
  const [type, setType] = useState('choose');

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
