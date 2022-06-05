import React, { FormEvent, useState } from 'react';
import { Button } from 'features/common/Button';
import { Input } from 'features/form/Input';
import { useCreateExerciseMutation } from 'features/exercises/api/useCreateExerciseMutation';
import { useQueryClient } from 'react-query';

interface Props {
  setIsOpen: (type: boolean) => void;
}

export const CreateCardioExerciseForm = ({ setIsOpen }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutate, isLoading, isError, error } = useCreateExerciseMutation();
  const queryClient = useQueryClient();

  const handleSubmit = (e: FormEvent) => {
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
          console.log('error', { e });
        },
      }
    );
  };

  return (
    <section className="text-white">
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
          <p className="pt-2 text-red-600 text-center">
            {(error as { message: string })?.message}...
          </p>
        )}
      </form>{' '}
    </section>
  );
};
