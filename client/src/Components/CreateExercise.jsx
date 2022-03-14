import { useState } from 'react';
import { Input } from './Input';
import { RadioGroup } from './RadioGroup';
import { Select } from './Select';
import { SelectMuscleGroups } from './SelectMuscleGroups';
import Link from 'next/link';
import Button from './Button';

export const CreateExercise = ({ exercises, setExercises }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [profile, setProfile] = useState('short');
  const [primary, setPrimary] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    /**
     *  BODY OF `/exercises/`
     *  API POST REQUEST
     *
     *  name: string;
     *  description: string;
     *  category: string;
     *  primary: string[];
     *  secondary: string[];
     *  video: string;
     *  profile: string;
     */

    const exercise = {
      name,
      description,
      category,
      profile,
      primary: [1],
      secondary: [],
    };

    console.log({ exercise });

    setIsLoading(true);

    fetch('http://localhost:4000/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise),
    }).then(() => {
      console.log('new exercise added');
      setIsLoading(false);
    });
  };

  return (
    <>
      <Button href="/exercises">Exercises</Button>
      <Button href="/">Home</Button>
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

        {/* 
          Create the following component:

           <SelectMuscleGroups 
            onPrimaryChange={*function*} ex a function that handles the state for the primary muscle groups selected
            onSecondaryChange={*function*} ex a function that handles the state for the primary muscle groups selected
            primary={*Array of Objects (muscle groups)*} -- state
            secondary={*Array of Objects (muscle groups)*} -- state
          /> 
        */}
        <label> Muscle groups: </label>
        <input type="text" placeholder="primary" />
        <input type="text" placeholder="secondary" />

        <SelectMuscleGroups label="Select" />

        <Button isLoading={isLoading}>{isLoading ? 'Adding exercise...' : 'Add exercise'}</Button>
      </form>
    </>
  );
};
