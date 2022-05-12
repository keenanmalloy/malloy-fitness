import { Input } from 'features/form/Input';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'features/common/useDebounce';
import { BiX } from 'react-icons/bi';
import Modal from 'features/modal/Modal';
import { useUpdateSessionExerciseMetadataMutation } from 'features/workout-exercises/api/useUpdateSessionExerciseMetadataMutation';

interface Props {
  exercise: any;
  exerciseId: string;
  exNotes: string;
  workoutId: string;
}

export const Notes = ({ exercise, exerciseId, exNotes, workoutId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes(exNotes);
  }, [exNotes]);

  return (
    <div className="px-5">
      <section className="text-sm break-words">
        <pre className="text-sm break-words whitespace-pre-wrap">{notes}</pre>
      </section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full"
      >
        Notes
      </button>
      <Modal
        isOpen={isOpen}
        title={`Notes for ${exercise.name}`}
        description={`Your notes will be saved with this exercise.`}
        closeModal={() => setIsOpen(false)}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-0 top-0 p-3"
        >
          <BiX />
        </button>
        <SaveNotes
          notes={notes}
          setNotes={setNotes}
          workoutId={workoutId}
          exerciseId={exerciseId}
          exNotes={exercise.notes}
        />
        <div className="h-20" />
      </Modal>
    </div>
  );
};

interface SaveNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
  workoutId: string;
  exerciseId: string;
  exNotes: string;
}

const SaveNotes = ({
  exNotes,
  notes,
  setNotes,
  workoutId,
  exerciseId,
}: SaveNotesProps) => {
  const debouncedNotes = useDebounce(notes, 600);
  const { mutate, isLoading } = useUpdateSessionExerciseMetadataMutation({
    workoutId,
    exerciseId,
  });

  useEffect(() => {
    if (debouncedNotes && exNotes !== debouncedNotes) {
      mutate({
        notes: debouncedNotes,
      });
    }
  }, [debouncedNotes]);

  return (
    <Input
      onChange={(e) => setNotes(e.target.value)}
      value={notes}
      placeholder="Add all your notes here: execution, setup, goals, ideas etc."
      isTextArea
      isLoading={isLoading}
      label={''}
      autoFocus
    />
  );
};
