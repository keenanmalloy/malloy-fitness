import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Modal from 'features/common/Modal';
import { Button } from 'features/common/Button';
import { generateCalendarState } from './generateCalendarState';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

export const CalendarComponent = ({
  displayDate,
  setSelectedDate,
  setSelected,
  items,
  scrollToItem,
  setItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, onChange] = useState(new Date());

  const handleScheduling = () => {
    const filteredItem = items.filter(
      (item) =>
        item.month === value.getMonth() + 1 &&
        item.year === value.getFullYear() &&
        item.day === value.getDate()
    )[0];

    if (!filteredItem?.id) {
      setSelectedDate(value);
      setSelected(filteredItem);
      scrollToItem(filteredItem.id);
      setIsOpen(false);
      return;
    }

    setSelected(filteredItem);
    scrollToItem(filteredItem.id);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="text-white flex items-center"
        onClick={() => setIsOpen(true)}
      >
        <div>{displayDate}</div>
        {isOpen ? <BiChevronUp /> : <BiChevronDown />}
      </button>
      <Modal
        title="Schedule"
        description="Schedule a workout"
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
      >
        <Calendar
          onChange={(d) => {
            const filteredItem = items.filter(
              (item) =>
                item.month === d.getMonth() + 1 &&
                item.year === d.getFullYear() &&
                item.day === d.getDate()
            );
            if (!filteredItem.length) {
              setItems(generateCalendarState(d));
            }

            onChange(d);
          }}
          value={value}
          maxDetail="month"
          minDetail="month"
          next2Label=""
          prev2Label=""
          nextLabel={<span className="px-2">&gt;</span>}
          prevLabel={<span className="px-2">&lt;</span>}
          tileClassName={({ activeStartDate, date, view }) => {
            return null;
          }}
          tileDisabled={({ activeStartDate, date, view }) => {
            return null;
          }}
        />

        <Button className="w-full mt-2" onClick={handleScheduling}>
          Select
        </Button>
      </Modal>
    </>
  );
};
