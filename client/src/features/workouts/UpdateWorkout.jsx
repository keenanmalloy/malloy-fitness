import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import Upload from 'features/Upload';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateWorkoutMutation } from './useUpdateWorkoutMutation';
import Modal from 'features/common/Modal';
import { Select } from 'features/form/Select';

export const UpdateWorkout = ({ workout }) => {
  const [name, setName] = useState(workout.name);
  const [description, setDescription] = useState(workout.description);
  const [category, setCategory] = useState(workout.category);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, mutate, isError } = useUpdateWorkoutMutation(
    workout.workout_id
  );

  const handleSubmit = (e) => {
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
          queryClient.refetchQueries('fetchWorkout');
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Update Workout</Button>

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

          <Select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            label="category"
            isRequired
            options={['chest', 'arms', 'back', 'legs', 'shoulders']}
            defaultOption={[]}
          />

          <Upload />

          <Button disabled={isLoading}>
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
