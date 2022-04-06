import { useState } from 'react';
import { Input } from 'features/form/Input';
import { Select as SelectComponent } from 'features/form/Select';
import { Button } from 'features/common/Button';
import Select from 'react-select';
import { useCreateWorkoutMutation } from './useCreateWorkoutMutation';
import { ChooseWorkoutExercises } from './ChooseWorkoutExercises';

export const CreateWorkout = ({ exercises }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [data, setData] = useState([]);
  const { mutate, isLoading, isError } = useCreateWorkoutMutation();
  const [exercises, setExercises] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const workout = {
      name: name,
      description: description,
      category: category,
      // exercises: data.map((ex) => {
      //   return {
      //     id: ex.value,
      //   };
      // }),
    };
    mutate({ workout });
  };

  return (
    <>
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
        <div>{exercises.join(', ')}</div>
        <ChooseWorkoutExercises
          exercises={exercises}
          setExercises={setExercises}
        />

        {/* <Select
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
        /> */}

        {/* <Button isLoading={isLoading}>
          {isLoading ? 'Adding workout...' : 'Add workout'}
        </Button> */}
      </form>
    </>
  );
};
