import { useUpdateWorkoutMutation } from 'features/workouts/api/useUpdateWorkoutMutation';
import { ChangeEventHandler, useEffect } from 'react';
import { CgSpinner } from 'react-icons/cg';

interface AccountFieldProps {
  value: string | null;
  prevValue: string | null;
  field: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  isTextArea?: boolean;
  placeholder?: string;
  className?: string;
  workoutId: string;
}

export const EditableSessionWorkoutTitle = ({
  value,
  field,
  placeholder,
  type,
  onChange,
  prevValue,
  workoutId,
}: AccountFieldProps) => {
  const { mutate, isLoading, isError } = useUpdateWorkoutMutation(workoutId);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value !== prevValue) {
        mutate({
          workout: {
            name: value,
          },
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value, field]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    event.target.select();

  return (
    <div className="flex-1 text-2xl relative text-white px-2 py-1">
      <input
        onChange={onChange}
        value={value ?? ''}
        type={type}
        placeholder={placeholder}
        className="text-center bg-slate-800 rounded-md w-full py-1"
        onFocus={handleFocus}
      />
      {isLoading && (
        <CgSpinner
          size={28}
          className="animate-spin text-green-500 absolute top-0 right-0"
        />
      )}
      {isError && (
        <div className=" w-full pb-1 text-center">
          <small className="text-red-600 text-xs">
            Error updating workout title
          </small>
        </div>
      )}
    </div>
  );
};
