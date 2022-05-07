export const isToday = (someDate: Date, index = 0) => {
  const today = getFutureDate(index);
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export const getFutureDate = (index: number) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + index);
  return futureDate;
};
