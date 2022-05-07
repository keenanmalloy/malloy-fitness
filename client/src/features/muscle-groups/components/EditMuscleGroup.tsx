import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import Upload from 'features/Upload';
import { FormEvent, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useUpdateMuscleGroupMutation } from 'features/muscle-groups/api/useUpdateMuscleGroupMutation';
import Modal from 'features/modal/Modal';
import { MdEdit } from 'react-icons/md';
import { MuscleGroup } from '../types';

interface Props extends Omit<MuscleGroup, 'muscle_group_id'> {
  id: string;
  refetchKey: string;
}

export const EditMuscleGroup = (props: Props) => {
  const { id, refetchKey } = props;
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [image, setImage] = useState(props.image);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, mutate, isError } = useUpdateMuscleGroupMutation(id);

  const handleSubmit = (e: FormEvent) => {
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
          queryClient.refetchQueries(refetchKey);
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
            value={description ?? ''}
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
            defaultSrc={image ?? ''}
          />

          <Button isDisabled={isLoading} className="w-full mt-2">
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
