import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { RadioGroup } from 'features/form/RadioGroup';
import { Select } from 'features/form/Select';
import { SelectMuscleGroups } from 'features/muscle-groups/SelectMuscleGroups';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateExerciseMutation } from './useUpdateExerciseMutation';
import Modal from 'features/common/Modal';

export const UpdateExercise = ({ exercise, muscleGroups }) => {
  const [name, setName] = useState(exercise.name);
  const [description, setDescription] = useState(exercise.description);
  const [category, setCategory] = useState(exercise.category);
  const [profile, setProfile] = useState(exercise.profile);
  const [primary, setPrimary] = useState(exercise.primary);
  const [secondary, setSecondary] = useState(exercise.secondary);
  const [isOpen, setIsOpen] = useState(false);

  console.log({ primary, secondary });

  const queryClient = useQueryClient();

  const { isLoading, mutate, isError } = useUpdateExerciseMutation(
    exercise.exercise_id
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const exercise = {
      name,
      description,
      category,
      profile,
      primary: primary.map((object) => object.value),
      secondary: secondary.map((object) => object.value),
    };

    mutate(
      { exercise },
      {
        onSuccess: () => {
          queryClient.refetchQueries('fetchExercise');
          setIsOpen(false);
        },
      }
    );
  };
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Update Exercise</Button>

      <Modal
        isOpen={isOpen}
        title="Editing Muscle Group"
        description={'a form to edit a muscle-group'}
        closeModal={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            label="Exercise name: "
            isRequired={true}
            isTextArea={false}
          />
          <Input
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            label="Exercise description: "
            isRequired={true}
            isTextArea={true}
          />
          <Select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            label="Exercise category: "
            isRequired={true}
            options={['chest', 'arms', 'back', 'legs', 'shoulders']}
            defaultOption="--choose a category --"
          />
          <RadioGroup
            label="Resistance profile: "
            onChange={(option) => {
              return setProfile(option);
            }}
            checked={profile}
            isRequired={true}
            options={['short', 'mid', 'long']}
            name="resistance-range"
          />

          <SelectMuscleGroups
            setData={setPrimary}
            defaultValue={primary.map((mg) => {
              return {
                label: mg.name,
                value: mg.muscle_group_id,
              };
            })}
            label="Primary muscle group: "
            muscleGroups={muscleGroups}
          />
          <SelectMuscleGroups
            setData={setSecondary}
            defaultValue={secondary.map((mg) => {
              return {
                label: mg.name,
                value: mg.muscle_group_id,
              };
            })}
            label="Secondary muscle group: "
            muscleGroups={muscleGroups}
          />

          <Button disabled={isLoading}>
            {isLoading ? 'Updating exercise...' : 'Update exercise'}
          </Button>
          {isError && (
            <small className="text-red-500">Something went wrong...</small>
          )}
        </form>
      </Modal>
    </>
  );
};
