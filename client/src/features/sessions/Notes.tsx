import FullPageModal from 'features/modal/FullPageModal';
import { Input } from 'features/form/Input';
import React, { useEffect, useState } from 'react';
import { useUpdateWorkoutExerciseMetadataMutation } from 'features/workout-exercises/api/useUpdateWorkoutExerciseMetadataMutation';
import { useDebounce } from 'features/common/useDebounce';

interface Props {
  exercise: any;
  workoutId: string;
  exerciseId: string;
  exNotes: string;
  sessionId: string;
}

export const Notes = ({
  exercise,
  workoutId,
  exerciseId,
  exNotes,
  sessionId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes(exNotes);
  }, [exNotes]);

  return (
    <div className="p-5">
      <section>
        <h3 className="text-sm">{notes}</h3>
      </section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full"
      >
        Notes
      </button>
      <FullPageModal
        isOpen={isOpen}
        title={`Notes for ${exercise.name}`}
        description={`Your notes will be saved with this exercise.`}
        closeModal={() => setIsOpen(false)}
      >
        <SaveNotes
          notes={notes}
          setNotes={setNotes}
          workoutId={workoutId}
          exerciseId={exerciseId}
          exNotes={exercise.notes}
        />
      </FullPageModal>
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
  const { mutate, isLoading } = useUpdateWorkoutExerciseMetadataMutation({
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
    />
  );
};
