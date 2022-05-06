import { v4 as uuidv4 } from 'uuid';

export const generateCalendarState = (selectedDate) => {
  const currentMonthState = [
    ...Array(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      ).getDate()
    ),
  ].map((_, key) => {
    return {
      day: key + 1,
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
      id: uuidv4(),
    };
  });

  const nextMonthInDaysState = [
    ...Array(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 2,
        0
      ).getDate()
    ).keys(),
  ].map((_, key) => {
    return {
      day: key + 1,
      month: selectedDate.getMonth() + 2,
      year: selectedDate.getFullYear(),
      id: uuidv4(),
    };
  });

  const previousMonthInDaysState = [
    ...Array(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0).getDate()
    ).keys(),
  ].map((_, key) => {
    return {
      day: key + 1,
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
      id: uuidv4(),
    };
  });

  return [
    ...previousMonthInDaysState,
    ...currentMonthState,
    ...nextMonthInDaysState,
  ];
};
