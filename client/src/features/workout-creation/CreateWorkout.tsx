import { FormEvent, useState } from 'react';
import { Input } from 'features/form/Input';
import { useCreateWorkoutMutation } from 'features/workout-creation/useCreateWorkoutMutation';
import { ChooseWorkoutExercises } from 'features/workout-creation/ChooseWorkoutExercises';
import Select from 'react-select';
import { WORKOUT_CATEGORIES } from 'features/environment';
import { WorkoutExercisesPreview } from 'features/workout-creation/WorkoutExercisesPreview';
import { Button } from 'features/common/Button';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { selectStyles } from 'features/common/selectStyles';

export interface LocalExercise {
  id: string;
  order: number;
  repetitions: number;
  repsInReserve: number;
  restPeriod: number;
  sets: number;
  superset?: string;
}

export const CreateWorkout = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const { mutate, isLoading, isError } = useCreateWorkoutMutation();
  const [exercises, setExercises] = useState<LocalExercise[]>([]);

  const [isCategoryError, setIsCategoryError] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const workout = {
      name: name,
      description: description,
      category: category,
      exercises: exercises.map((ex, key) => {
        return {
          id: ex.id,
          repetitions: ex.repetitions,
          repsInReserve: ex.repsInReserve,
          restPeriod: ex.restPeriod,
          sets: ex.sets,
          // superset: ex.superset,
        };
      }),
    };

    mutate(workout, {
      onSuccess: () => {
        setIsOpen(false);
        queryClient.refetchQueries('workouts');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <h1 className="py-5 text-xl">Create a new workout</h1>
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
          options={WORKOUT_CATEGORIES}
        />
        {isCategoryError && (
          <div className="text-red-500 text-xs italic text-right">
            Please select a category
          </div>
        )}
      </div>
      <WorkoutExercisesPreview
        exercises={exercises}
        setExercises={setExercises}
      />

      <ChooseWorkoutExercises
        exercises={exercises}
        setExercises={setExercises}
      />

      <Button isLoading={isLoading} className="w-full mt-2">
        {isLoading ? 'Adding workout...' : 'Add workout'}
      </Button>
      {isError && (
        <small className="text-red-500">Something went wrong...</small>
      )}
      <div className="h-20" />
    </form>
  );
};
