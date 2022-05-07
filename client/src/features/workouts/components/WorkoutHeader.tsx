interface Props {
  hasEnded: boolean;
  hasStarted: boolean;
  scheduledAt: string;
}

export const WorkoutHeader = ({ hasEnded, hasStarted, scheduledAt }: Props) => {
  if (hasEnded) {
    return (
      <header className="w-full bg-green-50 px-2 py-2 mb-2 rounded-sm">
        <span className="text-xs flex justify-center items-center">
          Workout completed
        </span>
      </header>
    );
  }

  if (hasStarted) {
    return (
      <header className="w-full bg-red-50 px-2 py-2 mb-2 rounded-sm">
        <span className="text-xs flex justify-center items-center">
          Workout in progress
        </span>
      </header>
    );
  }

  if (!!scheduledAt) {
    return (
      <header className="w-full bg-blue-50 px-2 py-2 mb-2 rounded-sm">
        <span className="text-xs flex justify-center items-center">
          Scheduled{' '}
          {new Intl.DateTimeFormat('en-CA', {
            month: 'short',
            day: '2-digit',
          }).format(new Date(scheduledAt))}
        </span>
      </header>
    );
  }

  return null;
};
