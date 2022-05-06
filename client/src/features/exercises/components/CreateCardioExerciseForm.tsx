import React, { useState } from 'react';
import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { useCreateExerciseMutation } from 'features/exercises/api/useCreateExerciseMutation';
import { useQueryClient } from 'react-query';

export const CreateCardioExerciseForm = ({ setIsOpen }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutate, isLoading, isError, error } = useCreateExerciseMutation();
  const queryClient = useQueryClient();

  const handleSubmit = (e) => {
    e.preventDefault();

    const exercise = {
      name,
      description,
      primaryTracker: 'time',
      secondaryTracker: 'distance',
      type: 'cardio',
    };

    mutate(
      { exercise },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          queryClient.refetchQueries('fetchExercises');
          setIsOpen(false);
        },
        onError: (e) => {
          console.log('error', e.message);
        },
      }
    );
  };

  return (
    <section>
      <h1 className="py-3 text-lg text-center">Creating Cardio Exercise</h1>
      <form onSubmit={handleSubmit}>
        <Input
          onChange={(e) => setName(e.target.value)}
          value={name}
          label="Name"
          isRequired
        />
        <Input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          label="Description"
          isTextArea
        />

        <Button isLoading={isLoading} className="mt-2 w-full">
          {isLoading ? 'Adding exercise...' : 'Add exercise'}
        </Button>
        {isError && (
          <p className="pt-2 text-red-600 text-center">{error.message}...</p>
        )}
      </form>{' '}
    </section>
  );
};
