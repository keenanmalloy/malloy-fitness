import { useState } from 'react';
import { Input } from './Input';
import { Select as SelectComponent } from './Select';
import { Button } from './Button';
import Select from 'react-select';

export const CreateWorkout = ({ workouts, setWorkouts, exercises }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const workout = {
      name: name,
      description: description,
      category: category,
      exercises: data.map((ex) => {
        return ex.value;
      }),
    };

    setIsLoading(true);

    fetch('http://localhost:4000/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
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
        <SelectComponent
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          label="Workout category: "
          isRequired={true}
          options={['chest', 'arms', 'back', 'legs', 'shoulders']}
          defaultOption="--choose a category --"
        />

        <Select
          id="long-value-select"
          instanceId="long-value-select"
          defaultValue={[]}
          isMulti
          onChange={(data) => setData(data)}
          name="exercises"
          options={exercises.map((exercise) => {
            return {
              label: exercise.name,
              value: exercise.exercise_id,
            };
          })}
          className="basic-multi-select"
          classNamePrefix="select"
        />

        <Button isLoading={isLoading}>
          {isLoading ? 'Adding workout...' : 'Add workout'}
        </Button>
      </form>
    </>
  );
};
