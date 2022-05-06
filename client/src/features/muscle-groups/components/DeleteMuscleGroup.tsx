import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDeleteMuscleGroupMutation } from 'features/muscle-groups/api/useDeleteMuscleGroupMutation';
import { MdDelete } from 'react-icons/md';

interface Props {
  id: string;
}

export const DeleteMuscleGroup = ({ id }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useDeleteMuscleGroupMutation();

  const queryCLient = useQueryClient();

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        queryCLient.refetchQueries('fetchMuscleGroups');
      },
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="px-0 py-0">
        <MdDelete className="h-6 w-10" />
      </Button>
      <Modal
        isOpen={isOpen}
        title="Delete Muscle Group"
        description={'Are you sure you would like to delete this muscle-group?'}
        closeModal={() => setIsOpen(false)}
      >
        <div className="flex justify-between pt-3">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} isDisabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        {isError && (
          <small className="text-red-500">Something went wrong...</small>
        )}
      </Modal>
    </>
  );
};
