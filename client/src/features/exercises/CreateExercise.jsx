import { useState } from 'react';
import { Input } from 'features/form/Input';
import { RadioGroup } from 'features/form/RadioGroup';
import { Select } from '../form/Select';
import { SelectMuscleGroups } from 'features/muscle-groups/SelectMuscleGroups';
import { Button } from 'features/common/Button';
import { useCreateExerciseMutation } from './useCreateExerciseMutation';

export const CreateExercise = ({ muscleGroups }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [profile, setProfile] = useState('short');
  const [primary, setPrimary] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const { mutate, isLoading, isError } = useCreateExerciseMutation();

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
    mutate({ exercise });
  };

  return (
    <>
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
          label="Primary"
          muscleGroups={muscleGroups}
        />
        <SelectMuscleGroups
          setData={setSecondary}
          label="Secondary"
          muscleGroups={muscleGroups}
        />

        <Button isLoading={isLoading}>
          {isLoading ? 'Adding exercise...' : 'Add exercise'}
        </Button>
        {isError && <div>{isError}</div>}
      </form>
    </>
  );
};
