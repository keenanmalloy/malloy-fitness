import React, { useEffect } from 'react';
import { useAccountFieldMutation } from './useAccountFieldMutation';
import { Input } from 'features/form/Input';

export const AccountField = ({
  label,
  value,
  field,
  onChange,
  prevValue,
  isTextArea,
}) => {
  if (!field || !label) {
    throw new Error('field and label are required');
  }

  const { mutate, isLoading, isError } = useAccountFieldMutation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value !== prevValue) {
        mutate({
          payload: {
            [field]: value,
          },
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value, field]);

  return (
    <>
      <Input
        label={label}
        onChange={onChange}
        value={value}
        isTextArea={isTextArea}
        isLoading={isLoading}
      />
      {isError && (
        <div className="text-right w-full pb-1">
          <small className="text-red-600 text-xs">
            Error updating {label.toLowerCase()}
          </small>
        </div>
      )}
    </>
  );
};
