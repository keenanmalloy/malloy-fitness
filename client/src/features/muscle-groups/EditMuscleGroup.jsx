import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import Upload from 'features/Upload';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateMuscleGroupMutation } from './useUpdateMuscleGroupMutation';
import Modal from 'features/common/Modal';
import { MdEdit } from 'react-icons/md';

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
      <Button onClick={() => setIsOpen(true)} className="px-0 py-0">
        <MdEdit className="h-6 w-10" />
      </Button>

      <Modal
        isOpen={isOpen}
        title="Editing Muscle Group"
        description={'A form to edit a muscle-group'}
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

          <Upload
            onChange={(key) => {
              if (key) {
                setImage(`https://cdn.trckd.ca/${key}`);
              } else {
                setImage(null);
              }
            }}
            defaultSrc={image}
          />

          <Button disabled={isLoading} className="w-full mt-2">
            {isLoading ? 'Updating...' : 'Update'}
          </Button>

          {isError && (
            <small className="text-red-500 pt-2">Something went wrong...</small>
          )}
        </form>
      </Modal>
    </>
  );
};