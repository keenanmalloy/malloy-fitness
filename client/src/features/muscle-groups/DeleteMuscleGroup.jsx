import { Button } from 'features/common/Button';
import Modal from 'features/common/Modal';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDeleteMuscleGroupMutation } from './useDeleteMuscleGroupMutation';

export const DeleteMuscleGroup = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useDeleteMuscleGroupMutation();

  const queryCLient = useQueryClient();

  const handleDelete = () => {
    mutate(
      { id },
      {
        onSuccess: () => {
          queryCLient.refetchQueries('fetchMuscleGroups');
        },
      }
    );
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Delete</Button>
      <Modal
        isOpen={isOpen}
        title="Delete Muscle Group"
        description={'Are you sure you would like to delete this muscle-group?'}
        closeModal={() => setIsOpen(false)}
      >
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button onClick={handleDelete} disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
        {isError && (
          <small className="text-red-500">Something went wrong...</small>
        )}
      </Modal>
    </>
  );
};
