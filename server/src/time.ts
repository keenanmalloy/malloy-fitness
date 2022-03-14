export const toUnix = (timestampz: Date): number => {
  return Math.floor(new Date(timestampz).getTime());
};

type Miliseconds = number;

export const toTimestampz = (unix: Miliseconds): Date => {
  return new Date(unix);
};

type Timestampz = Date;

export const formatTime = (time: Timestampz) => {
  return new Intl.DateTimeFormat("en-US").format(new Date(time));
};
