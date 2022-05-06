import React, { ChangeEventHandler, useEffect } from 'react';
import { useAccountFieldMutation } from 'features/account/api/useAccountFieldMutation';
import { Input } from 'features/form/Input';
import Select from 'react-select';

interface AccountFieldProps {
  label: string;
  value: string | number;
  prevValue: string | number;
  field: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  isTextArea?: boolean;
}

export const AccountField = ({
  label,
  value,
  field,
  type,
  onChange,
  prevValue,
  isTextArea,
}: AccountFieldProps) => {
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
    <div className="flex-1">
      <Input
        label={label}
        onChange={onChange}
        value={value}
        isTextArea={isTextArea}
        isLoading={isLoading}
        type={type}
      />
      {isError && (
        <div className="text-right w-full pb-1">
          <small className="text-red-600 text-xs">
            Error updating {label.toLowerCase()}
          </small>
        </div>
      )}
    </div>
  );
};

interface AccountSelectFieldProps {
  label: string;
  value: string;
  field: string;
  type?: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  prevValue: string;
}

export const AccountSelectField = ({
  label,
  value,
  field,
  onChange,
  options,
  prevValue,
}: AccountSelectFieldProps) => {
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
    <div className="flex-1 py-2 relative w-full">
      <label>{label}</label>
      <Select
        onChange={(data) => {
          onChange(data?.value ?? '');
        }}
        isSearchable={false}
        className="flex-1"
        styles={{
          control: (base) => ({
            ...base,
          }),
        }}
        defaultValue={{
          label: value,
          value: value,
        }}
        options={options}
      />

      {isError && (
        <div className="text-right w-full pb-1">
          <small className="text-red-600 text-xs">
            Error updating {label.toLowerCase()}
          </small>
        </div>
      )}
    </div>
  );
};
