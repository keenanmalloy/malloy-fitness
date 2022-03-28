import { useState } from 'react';
import { Input } from 'features/form/Input';
import { RadioGroup } from 'features/form/RadioGroup';
import { Select } from '../form/Select';
import { SelectMuscleGroups } from 'features/muscle-groups/SelectMuscleGroups';
import { Button } from 'features/common/Button';

export const CreateExercise = ({ exercises, setExercises, muscleGroups }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [profile, setProfile] = useState('short');
  const [primary, setPrimary] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

    setIsLoading(true);

    fetch('http://localhost:4000/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error('could not add exercise');
        }
        console.log('New exercise added', { exercise });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
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
        {error && <div>{error}</div>}
      </form>
    </>
  );
};
