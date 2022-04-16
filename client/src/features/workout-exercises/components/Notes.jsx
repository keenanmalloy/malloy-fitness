import FullPageModal from 'features/common/FullPageModal';
import { Input } from 'features/form/Input';
import React, { useEffect, useState } from 'react';
import { useUpdateWorkoutExerciseMetadataMutation } from '../api/useUpdateWorkoutExerciseMetadataMutation';

export const Notes = ({ exercise, workoutId, exerciseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(exercise.notes);

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
          exercise={exercise}
          notes={notes}
          setNotes={setNotes}
          workoutId={workoutId}
          exerciseId={exerciseId}
        />
      </FullPageModal>
    </div>
  );
};

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SaveNotes = ({ exercise, notes, setNotes, workoutId, exerciseId }) => {
  const debouncedNotes = useDebounce(notes, 600);
  const { mutate, isLoading } = useUpdateWorkoutExerciseMetadataMutation({
    workoutId,
    exerciseId,
  });

  useEffect(() => {
    if (debouncedNotes && exercise.notes !== debouncedNotes) {
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
    />
  );
};
