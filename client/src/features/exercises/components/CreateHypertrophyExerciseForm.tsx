import React, { FormEvent, useState } from 'react';
import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { RadioGroup } from 'features/form/RadioGroup';
import { useCreateExerciseMutation } from 'features/exercises/api/useCreateExerciseMutation';
import Select from 'react-select';
import { useQueryClient } from 'react-query';
import { EXERCISE_CATEGORIES } from 'features/environment';
import { MuscleGroup } from 'features/muscle-groups/types';
import { selectStyles } from 'features/common/selectStyles';

interface Props {
  setIsOpen: (type: boolean) => void;
  muscleGroups: MuscleGroup[];
}

export const CreateHypertrophyExerciseForm = ({
  muscleGroups,
  setIsOpen,
}: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [profile, setProfile] = useState('short');
  const [primary, setPrimary] = useState<{ value: string; label: string }[]>(
    []
  );
  const [secondary, setSecondary] = useState<
    { value: string; label: string }[]
  >([]);
  const [isCategoryError, setIsCategoryError] = useState(false);

  const { mutate, isLoading, isError, error } = useCreateExerciseMutation();

  const queryClient = useQueryClient();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const exercise = {
      name,
      description,
      category,
      profile,
      type: 'hypertrophy',
      primaryTracker: 'weight',
      secondaryTracker: 'reps',
      primary: primary.map((object) => object.value),
      secondary: secondary.map((object) => object.value),
    };

    if (!exercise.category) {
      setIsCategoryError(true);
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
          setIsOpen(false);
        },
        onError: (e) => {
          console.log('error', { e });
        },
      }
    );
  };

  return (
    <section className="text-white">
      <h1 className="py-3 text-lg text-center">
        Creating Hypertrophy Exercise
      </h1>
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
              setCategory(data?.value ?? '');
              setIsCategoryError(false);
            }}
            isSearchable={false}
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
              ...selectStyles,
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
          <label>Primary Muscle Group(s)</label>
          <Select
            isMulti
            styles={{
              control: (base) => ({
                ...base,
              }),
              ...selectStyles,
            }}
            onChange={(data) => {
              setPrimary([...data]);
            }}
            name="primary-muscle-groups"
            options={muscleGroups.map((muscleGroup) => {
              return {
                label: muscleGroup.name,
                value: muscleGroup.muscle_group_id,
              };
            })}
          />
        </div>

        <div className="py-2">
          <label>Secondary Muscle Group(s)</label>
          <Select
            isMulti
            onChange={(data) => setSecondary([...data])}
            name="secondary-muscle-groups"
            options={muscleGroups.map((muscleGroup) => {
              return {
                label: muscleGroup.name,
                value: muscleGroup.muscle_group_id,
              };
            })}
            styles={selectStyles}
          />
        </div>

        <Button isLoading={isLoading} className="mt-2 w-full">
          {isLoading ? 'Adding exercise...' : 'Add exercise'}
        </Button>
        {isError && (
          <p className="pt-2 text-red-600 text-center">
            {(error as { message: string }).message}...
          </p>
        )}
      </form>
    </section>
  );
};
