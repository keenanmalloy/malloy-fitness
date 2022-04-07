import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { RadioGroup } from 'features/form/RadioGroup';
import { useCreateExerciseMutation } from './useCreateExerciseMutation';
import Select from 'react-select';
import { useQueryClient } from 'react-query';
import { EXERCISE_CATEGORIES } from 'features/enviornment';

export const CreateExerciseForm = ({ muscleGroups }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [profile, setProfile] = useState('short');
  const [primary, setPrimary] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const [isPrimaryError, setIsPrimaryError] = useState(false);
  const [isCategoryError, setIsCategoryError] = useState(false);
  const { mutate, isLoading, isError, error } = useCreateExerciseMutation();

  const queryClient = useQueryClient();

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

    if (!exercise.category) {
      setIsCategoryError(true);
      return;
    }

    if (!exercise.primary.length) {
      setIsPrimaryError(true);
      return;
    }

    mutate(
      { exercise },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          setCategory('');
          setProfile('short');
          setPrimary([]);
          setSecondary([]);
          queryClient.refetchQueries('fetchExercises');
        },
        onError: (e) => {
          console.log('error', e.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        onChange={(e) => setName(e.target.value)}
        value={name}
        label="Name"
        isRequired
      />
      <Input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        label="Description"
        isTextArea
      />

      <div className="py-2">
        <label>Category</label>
        <Select
          onChange={(data) => {
            setCategory(data.value);
            setIsCategoryError(false);
          }}
          name="category"
          styles={{
            control: (base) => ({
              ...base,
              ...(isCategoryError
                ? {
                    borderColor: 'red-500',
                    boxShadow: '0 0 0 1px red inset',
                  }
                : {}),
            }),
          }}
          options={EXERCISE_CATEGORIES}
        />
        {isCategoryError && (
          <div className="text-red-500 text-xs italic text-right">
            Please select a category
          </div>
        )}
      </div>

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

      <div className="py-2">
        <label>Primary</label>
        <Select
          isMulti
          styles={{
            control: (base) => ({
              ...base,
              ...(isPrimaryError
                ? {
                    borderColor: 'red-500',
                    boxShadow: '0 0 0 1px red inset',
                  }
                : {}),
            }),
          }}
          onChange={(data) => {
            setPrimary(data);
            setIsPrimaryError(false);
          }}
          name="primary-muscle-groups"
          options={muscleGroups.map((muscleGroup) => {
            return {
              label: muscleGroup.name,
              value: muscleGroup.muscle_group_id,
            };
          })}
        />
        {isPrimaryError && (
          <div className="text-red-500 text-xs italic text-right">
            Please select a primary muscle-group
          </div>
        )}
      </div>

      <div className="py-2">
        <label>Secondary</label>
        <Select
          isMulti
          onChange={(data) => setSecondary(data)}
          name="secondary-muscle-groups"
          options={muscleGroups.map((muscleGroup) => {
            return {
              label: muscleGroup.name,
              value: muscleGroup.muscle_group_id,
            };
          })}
        />
      </div>

      <Button isLoading={isLoading} className="mt-2 w-full">
        {isLoading ? 'Adding exercise...' : 'Add exercise'}
      </Button>
      {isError && (
        <p className="pt-2 text-red-600 text-center">{error.message}...</p>
      )}
    </form>
  );
};
