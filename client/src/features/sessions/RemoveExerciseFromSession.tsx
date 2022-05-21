import { DefaultModal } from 'features/modal/DefaultModal';
import React, { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';
import { SessionSummaryResponse } from './types';
import { useRemoveExerciseFromSession } from './useRemoveExerciseFromSession';

interface Props {
  data: SessionSummaryResponse;
  workoutTaskId: string;
}

export const RemoveExerciseFromSession = ({ data, workoutTaskId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isLoading, isError } = useRemoveExerciseFromSession(
    data.session.session_id,
    data.session.workout_id
  );

  return (
    <div>
      <button className="p-3" onClick={() => setIsOpen(true)}>
        <BiX />
      </button>
      <DefaultModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        title="Are you sure you want to remove this exercise from the session?"
        description=""
      >
        <div className="flex flex-col items-center">
          <div className="flex w-full pt-5">
            <button
              className="flex justify-center items-center p-3 w-full"
              onClick={() => {
                mutate(
                  { workoutTaskId },
                  {
                    onSuccess: (data) => {
                      setIsOpen(false);
                    },
                  }
                );
              }}
            >
              <p className="text-center">
                {isLoading ? (
                  <CgSpinner className="w-6 h-6 animate-spin text-green-500" />
                ) : (
                  'Yes'
                )}
              </p>
            </button>
            <button
              className="flex justify-center items-center p-3 w-full"
              onClick={() => setIsOpen(false)}
            >
              <p className="text-center">No</p>
            </button>
          </div>
        </div>
      </DefaultModal>
    </div>
  );
};
