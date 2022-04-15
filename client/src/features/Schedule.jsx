import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';
import { useScheduleNewWorkoutMutation } from './workouts/api/useScheduleNewWorkoutMutation';

export const Schedule = ({ workoutId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, onChange] = useState(new Date());

  const { data, isError, isLoading, mutate } =
    useScheduleNewWorkoutMutation(workoutId);

  const currentDate = new Date();

  const handleScheduling = () => {
    // format date YYYY-MM-DD
    const date = value.toISOString().split('T')[0];
    mutate(
      {
        date,
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
          maxDate={new Date(currentDate.setMonth(currentDate.getMonth() + 3))}
          minDate={new Date()}
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
