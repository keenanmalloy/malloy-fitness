import { useState } from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

export const CreateWorkout = ({ workouts, setWorkouts }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const workout = {
      name,
      description,
      category,
      exercises,
    };

    setIsLoading(true);

    fetch('http://localhost:4000/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error('could not create workout');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <>
      <Button href="/workouts">Workouts</Button>
      <Button href="/">Home</Button>
      <form onSubmit={handleSubmit}>
        <Input
          onChange={(e) => setName(e.target.value)}
          value={name}
          label="Workout name: "
          isRequired={true}
          isTextArea={false}
        />
        <Input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          label="Workout description: "
          isRequired={true}
          isTextArea={true}
        />
        <Select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          label="Workout category: "
          isRequired={true}
          options={['chest', 'arms', 'back', 'legs', 'shoulders']}
          defaultOption="--choose a category --"
        />

        <Button isLoading={isLoading}>
          {isLoading ? 'Adding workout...' : 'Add workout'}
        </Button>
      </form>
    </>
  );
};
