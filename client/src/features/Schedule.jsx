import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';

export const Schedule = () => {
  const [value, onChange] = useState(new Date());

  const currentDate = new Date();

  return (
    <Modal
      title="Schedule"
      description="Schedule a workout"
      closeModal={() => console.log('closed')}
      isOpen={true}
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

      <Button className="w-full mt-2">Schedule</Button>
    </Modal>
  );
};
