import HomeModal from 'features/modal/HomeModal';
import React, { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IoAdd } from 'react-icons/io5';
import { SelectedDate } from './useDailyOverviewQuery';
import { useInitSessionMutation } from './useInitializeSessionMutation';

interface Props {
  selected: SelectedDate;
}

export const UserAction = ({ selected }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading, isError, error } = useInitSessionMutation();

  const createSession = async () => {
    mutate(
      {
        date: new Date(
          new Intl.DateTimeFormat('en-CA', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(
            selected.id
              ? new Date(selected.year, selected.month - 1, selected.day)
              : new Date()
          )
        ).toISOString(),
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <div className="fixed bottom-16 right-0 z-40 p-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 rounded-full bg-green-300 z-50 
          focus:ring-4 focus:ring-slate-700 
          "
        >
          <IoAdd
            className={`h-6 w-6 text-slate-800 ${isOpen ? 'rotate-45' : ''} `}
          />
        </button>
      </div>
      <HomeModal closeModal={() => setIsOpen(false)} isOpen={isOpen}>
        <button
          className="bg-gray-50 px-4 py-2 rounded-md"
          onClick={createSession}
          disabled={isLoading}
        >
          {isLoading && (
            <CgSpinner className="w-6 h-6 animate-spin absolute top-6 -left-2 text-green-400" />
          )}
          {isError && <span className="text-red-500">{error.message}</span>}
          Create session
        </button>
      </HomeModal>
    </>
  );
};
