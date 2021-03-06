import React, { FormEvent, useState } from 'react';
import { Input } from 'features/form/Input';
import { RadioGroup } from 'features/form/RadioGroup';
import { useQueryClient } from 'react-query';
import { useUpdateExerciseMutation } from 'features/exercises/api/useUpdateExerciseMutation';
import { Button } from 'features/common/Button';
import Select, { MultiValue } from 'react-select';
import { EXERCISE_CATEGORIES, EXERCISE_TRACKERS } from 'features/environment';
import { useAddMuscleGroupToExerciseMutation } from 'features/exercises/api/useAddMuscleGroupToExerciseMutation';
import { useRemoveMuscleGroupFromExerciseMutation } from 'features/exercises/api/useRemoveMuscleGroupFromExerciseMutation';
import { GetMuscleGroupsResponse } from 'features/muscle-groups/types';

interface Props {
  exercise: any;
  queryKey: string;
  setIsOpen: (type: boolean) => void;
  muscleGroups: GetMuscleGroupsResponse['muscleGroups'];
}

export const UpdateExerciseForm = ({
  exercise,
  muscleGroups,
  setIsOpen,
  queryKey,
}: Props) => {
  const [name, setName] = useState(exercise.name);
  const [description, setDescription] = useState(exercise.description);
  const [category, setCategory] = useState(exercise.category);
  const [profile, setProfile] = useState(exercise.profile);
  const [primary, setPrimary] = useState<any>(exercise.primary ?? []);
  const [secondary, setSecondary] = useState<any>(exercise.secondary ?? []);
  const [isPrimaryError, setIsPrimaryError] = useState(false);
  const [isCategoryError, setIsCategoryError] = useState(false);

  // tracking data
  const [primaryTracker, setPrimaryTracker] = useState(
    exercise.primary_tracker
  );
  const [secondaryTracker, setSecondaryTracker] = useState(
    exercise.secondary_tracker
  );

  const { isLoading, mutate, isError, error } = useUpdateExerciseMutation(
    exercise.exercise_id
  );

  const { mutate: addMuscleGroupMutation } =
    useAddMuscleGroupToExerciseMutation(exercise.exercise_id);
  const { mutate: removeMuscleGroupMutation } =
    useRemoveMuscleGroupFromExerciseMutation(exercise.exercise_id);

  const queryClient = useQueryClient();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const exercise = {
      name,
      description,
      category,
      profile,
      primary_tracker: primaryTracker,
      secondary_tracker: secondaryTracker,
    };

    mutate(
      { exercise },
      {
        onSuccess: () => {
          queryClient.refetchQueries(queryKey);
          setIsOpen(false);
        },
      }
    );
  };

  const updateMuscleGroup = ({
    data,
    group,
  }: {
    data: MultiValue<{ label: string; value: string }>;
    group: 'primary' | 'secondary';
  }) => {
    // get the muscle groups that are not in the primary array
    const newPrimary = data.map((object) => object.value);
    const oldPrimary = exercise[group as 'primary' | 'secondary'].map(
      (object: any) => object.muscle_group_id
    );

    // get difference array values in newPrimary and oldPrimary
    const difference =
      newPrimary.length > oldPrimary.length
        ? newPrimary.filter((x) => !oldPrimary.includes(x))
        : oldPrimary.filter((x: any) => !newPrimary.includes(x));

    const isAddition = newPrimary.length > oldPrimary.length;
    const isRemove = newPrimary.length < oldPrimary.length;

    if (isAddition) {
      addMuscleGroupMutation(
        {
          group,
          muscleGroupId: difference[0],
        },
        {
          onSuccess: () => {
            queryClient.refetchQueries(queryKey);
          },
        }
      );
    }

    if (isRemove) {
      for (const id of difference) {
        removeMuscleGroupMutation(
          {
            group,
            muscleGroupId: id,
          },
          {
            onSuccess: () => {
              queryClient.refetchQueries(queryKey);
            },
          }
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        onChange={(e) => setName(e.target.value)}
        value={name}
        label="Name"
        isTextArea={false}
      />
      <Input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        label="Description"
        isTextArea={true}
      />

      <div className="py-2">
        <label>What to Track</label>

        <div className="flex items-center flex-1 w-full">
          <div className="flex-1 w-full">
            <Select
              onChange={(data) => {
                setPrimaryTracker(data?.value ?? '');
              }}
              isSearchable={false}
              name="primaryTracker"
              styles={{
                control: (base) => ({
                  ...base,
                }),
              }}
              defaultValue={{
                label: primaryTracker,
                value: primaryTracker,
              }}
              options={EXERCISE_TRACKERS}
            />
          </div>
          <div className="flex-1 w-full">
            <Select
              onChange={(data) => {
                setSecondaryTracker(data?.value ?? '');
              }}
              isSearchable={false}
              name="secondaryTracker"
              styles={{
                control: (base) => ({
                  ...base,
                }),
              }}
              defaultValue={{
                label: secondaryTracker,
                value: secondaryTracker,
              }}
              options={EXERCISE_TRACKERS}
            />
          </div>
        </div>
      </div>

      {(primaryTracker === 'weight' || secondaryTracker === 'weight') && (
        <>
          <div className="py-2">
            <label>Category</label>
            <Select
              onChange={(data) => {
                setCategory(data?.value ?? '');
                setIsCategoryError(false);
              }}
              name="category"
              defaultValue={{
                label: category,
                value: category,
              }}
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
        </>
      )}

      <div className="py-2">
        <label>Primary</label>
        <Select
          isMulti
          defaultValue={primary.map(
            (mg: { name: any; muscle_group_id: any }) => {
              return {
                label: mg.name,
                value: mg.muscle_group_id,
              };
            }
          )}
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
            updateMuscleGroup({ data, group: 'primary' });
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
          defaultValue={secondary.map(
            (mg: { name: any; muscle_group_id: any }) => {
              return {
                label: mg.name,
                value: mg.muscle_group_id,
              };
            }
          )}
          onChange={(data) => {
            updateMuscleGroup({ data, group: 'secondary' });
            setSecondary(data);
            setIsPrimaryError(false);
          }}
          name="secondary-muscle-groups"
          options={muscleGroups.map((muscleGroup) => {
            return {
              label: muscleGroup.name,
              value: muscleGroup.muscle_group_id,
            };
          })}
        />
      </div>
      <Button isDisabled={isLoading} className="mt-2 w-full">
        {isLoading ? 'Updating exercise...' : 'Update exercise'}
      </Button>
      {isError && (
        <p className="pt-2 text-red-600 text-center">{error.message}...</p>
      )}
    </form>
  );
};
