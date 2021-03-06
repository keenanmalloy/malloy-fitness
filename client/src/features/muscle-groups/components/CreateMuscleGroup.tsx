import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import Upload from 'features/Upload';
import React, { FormEvent, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useCreateMuscleGroupMutation } from 'features/muscle-groups/api/useCreateMuscleGroupMutation';
import Modal from 'features/modal/Modal';

export const CreateMuscleGroup = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<null | string>(null);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, mutate, isError } = useCreateMuscleGroupMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const muscleGroup = {
      name,
      description,
      image: image ?? null,
    };

    mutate(muscleGroup, {
      onSuccess: () => {
        queryClient.refetchQueries('fetchMuscleGroups');
        setName('');
        setDescription('');
        setImage(null);
        setIsOpen(false);
      },
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)} className="w-full">
        Create Muscle Group
      </Button>

      <Modal
        isOpen={isOpen}
        title="Create Muscle Group"
        description={'a form to create a new muscle-group'}
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

          <Upload onChange={(key) => setImage(`https://cdn.trckd.ca/${key}`)} />

          <Button isDisabled={isLoading} className="w-full mt-2">
            {isLoading ? 'Creating...' : 'Create'}
          </Button>

          {isError && (
            <small className="text-red-500">Something went wrong...</small>
          )}
        </form>
      </Modal>
    </>
  );
};
