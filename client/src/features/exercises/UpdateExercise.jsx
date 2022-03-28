import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { RadioGroup } from 'features/form/RadioGroup';
import { Select } from 'features/form/Select';
import { SelectMuscleGroups } from 'features/muscle-groups/SelectMuscleGroups';
import React, { useState } from 'react';

export const UpdateExercise = ({ muscleGroups }) => {
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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
      body: JSON.stringify(exercise),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error('could not update exercise');
        }
        console.log('Exercise updated', { exercise });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
=======
      credentials: 'include',
      body: JSON.stringify({
        name: 'step forward curl',
        description:
          'row that shit',
        category: 'back',
        primary: 'back',
        secondary: 'biceps',
        image: '',
        video: '',
        movement: 'compound',
      }),
    }).then((res) => {
      return res.json();
    });
    updateSetExercises(response.exercise);
>>>>>>> 97a5acf42fb5f8ab9bf35e01dbac644a0dd1886c
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
          {isLoading ? 'Updating exercise...' : 'Update exercise'}
        </Button>
        {error && <div>{error}</div>}
      </form>
    </>
  );
};
