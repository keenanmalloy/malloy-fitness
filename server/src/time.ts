export const toUnix = (timestampz: Date): number => {
  return Math.floor(new Date(timestampz).getTime());
};

type Miliseconds = number;

export const toTimestampz = (unix: Miliseconds): Date => {
  return new Date(unix);
};

type Timestampz = Date;

export const formatTime = (time: Timestampz) => {
  return new Intl.DateTimeFormat('en-US').format(new Date(time));
};

//https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
export function isValidDate(dateString: string) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}
