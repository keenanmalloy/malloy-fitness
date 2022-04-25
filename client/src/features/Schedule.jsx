import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';
import { useScheduleSessionMutation } from './sessions/useScheduleSessionMutation';

export const Schedule = ({ workoutId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  const [value, onChange] = useState(currentDate);
  const { data, isError, isLoading, mutate } =
    useScheduleSessionMutation(workoutId);

  const handleScheduling = () => {
    mutate(
      {
        date: value,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: (error) => {
          // notify user
          console.log('error', error);
        },
      }
    );
  };

  return (
    <>
      <button
        className="bg-white mt-2 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-32"
        onClick={() => setIsOpen(true)}
      >
        Schedule
      </button>
      <Modal
        title="Schedule"
        description="Schedule a workout"
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
      >
        <Calendar
          onChange={onChange}
          value={value}
          maxDetail="month"
          minDetail="month"
          minDate={currentDate}
          next2Label=""
          prev2Label=""
          nextLabel=""
          prevLabel=""
          tileClassName={({ activeStartDate, date, view }) => {
            return null;
          }}
          tileDisabled={({ activeStartDate, date, view }) => {
            return null;
          }}
        />

        <Button className="w-full mt-2" onClick={handleScheduling}>
          {isLoading ? 'Scheduling...' : 'Schedule'}
        </Button>
      </Modal>
    </>
  );
};
