import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import Upload from 'features/Upload';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateMuscleGroupMutation } from './useUpdateMuscleGroupMutation';
import Modal from 'features/common/Modal';

export const EditMuscleGroup = ({ mg }) => {
  const [name, setName] = useState(mg.name);
  const [description, setDescription] = useState(mg.description);
  const [image, setImage] = useState(mg.image);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, mutate, isError } = useUpdateMuscleGroupMutation(
    mg.muscle_group_id
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const muscleGroup = {
      name,
      description,
      image,
    };

    mutate(
      { muscleGroup },
      {
        onSuccess: () => {
          queryClient.refetchQueries('fetchMuscleGroups');
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Edit</Button>

      <Modal
        isOpen={isOpen}
        title="Editing Muscle Group"
        description={'a form to edit a muscle-group'}
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
