import { DefaultModal } from 'features/modal/DefaultModal';
import React, { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';
import { useRemoveTaskExerciseFromSession } from './useRemoveTaskExerciseFromSession';
import { useRemoveTaskFromSession } from './useRemoveTaskFromSession';
import { SessionSchema } from './useSessionSummaryQuery';

interface Props {
  data: SessionSchema;
  workoutTaskId: string;
  isSuperset: boolean;
  exerciseId: string;
  taskExerciseId: string;
}

export const RemoveExerciseFromSession = ({
  data,
  workoutTaskId,
  isSuperset,
  exerciseId,
  taskExerciseId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    mutate: mutateTask,
    isLoading: isTaskMutationLoading,
    isError: isTaskIsError,
  } = useRemoveTaskFromSession(
    data.session.session_id,
    data.session.workout_id
  );

  const {
    mutate: mutateEx,
    isLoading: isExMutationLoading,
    isError: isExIsError,
  } = useRemoveTaskExerciseFromSession(
    data.session.session_id,
    data.session.workout_id
  );

  /**
   * Remove the task or exercise from the session
   *
   * Depends if the task is a superset or not
   * 1. If it's a superset, remove the exercise from the task
   * 2. If it's not a superset, remove the task from the session
   */
  const handleDeletion = () => {
    if (isSuperset) {
      mutateEx(
        { workoutTaskExerciseId: taskExerciseId, exerciseId },
        {
          onSuccess: (data) => {
            setIsOpen(false);
          },
        }
      );
    } else {
      mutateTask(
        { workoutTaskId },
        {
          onSuccess: (data) => {
            setIsOpen(false);
          },
        }
      );
    }
  };

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
              onClick={handleDeletion}
            >
              <p className="text-center">
                {isTaskMutationLoading || isExMutationLoading ? (
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
