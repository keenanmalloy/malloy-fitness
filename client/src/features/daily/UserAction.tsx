import HomeModal from 'features/modal/HomeModal';
import Router from 'next/router';
import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { SelectedDate } from './types';
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
        onSuccess: (data) => {
          if (!data.session) return;
          Router.push(`/sessions/${data.session.session_id}`);
        },
      }
    );
  };

  return (
    <>
      <div className="fixed bottom-16 right-0 z-40 p-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 rounded-full bg-slate-800 text-white z-50 "
        >
          <IoAdd
            className={`h-6 w-6 text-white ${isOpen ? 'rotate-45' : ''} `}
          />
        </button>
      </div>
      <HomeModal
        title="Schedule"
        description="Schedule a workout"
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
      >
        <button
          className="bg-gray-50 px-4 py-2 rounded-md"
          onClick={createSession}
        >
          Create session
        </button>
      </HomeModal>
    </>
  );
};
