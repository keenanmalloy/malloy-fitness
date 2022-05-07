import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { FormEvent, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateWorkoutMutation } from 'features/workouts/api/useUpdateWorkoutMutation';
import Modal from 'features/modal/Modal';
import { MdEdit } from 'react-icons/md';
import { WORKOUT_CATEGORIES } from 'features/environment';
import Select from 'react-select';

interface Props {
  workout: any;
  queryKey: string;
}

export const UpdateWorkout = ({ workout, queryKey }: Props) => {
  const [name, setName] = useState(workout.name);
  const [description, setDescription] = useState(workout.description);
  const [category, setCategory] = useState(workout.category);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryError, setIsCategoryError] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, mutate, isError } = useUpdateWorkoutMutation(
    workout.workout_id
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const workout = {
      name,
      category,
      description,
    };

    mutate(
      { workout },
      {
        onSuccess: () => {
          queryClient.refetchQueries(queryKey);
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)} className="px-0 py-2">
        <MdEdit className="h-6 w-10" />
      </Button>

      <Modal
        isOpen={isOpen}
        title="Editing Workout"
        description={'a form to edit a workout'}
        closeModal={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            label="name"
            isRequired
          />
          <Input
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            label="description"
            isTextArea
          />

          <div className="py-2">
            <label>Category</label>
            <Select
              onChange={(data) => {
                setCategory(data?.value ?? '');
                setIsCategoryError(false);
              }}
              value={{
                value: category,
                label: category,
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
              options={WORKOUT_CATEGORIES}
            />
          </div>

          <Button isDisabled={isLoading} className="w-full">
            {isLoading ? 'Updating...' : 'Update'}
          </Button>

          {isError && (
            <small className="text-red-500">Something went wrong...</small>
          )}
        </form>
      </Modal>
    </>
  );
};
