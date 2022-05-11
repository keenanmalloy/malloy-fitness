import React, { ChangeEventHandler, useEffect } from 'react';
import { useAccountFieldMutation } from 'features/account/api/useAccountFieldMutation';
import { CustomInput } from 'features/form/CustomInput';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';

interface AccountFieldProps {
  label: string;
  value: string | number;
  prevValue: string | number;
  field: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  isTextArea?: boolean;
  placeholder?: string;
  className?: string;
}

export const AccountField = ({
  label,
  value,
  field,
  className,
  placeholder,
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
      <CustomInput
        label={label}
        onChange={onChange}
        value={value}
        isLoading={isLoading}
        type={type}
        placeholder={placeholder}
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
    <div
      style={{
        paddingTop: '0.32rem',
      }}
      className="flex-1 relative w-full"
    >
      <label className={`text-gray-300 text-xs`}>{label}</label>
      <Select
        onChange={(data) => {
          onChange(data?.value ?? '');
        }}
        isSearchable={false}
        styles={{
          control: (base) => ({
            ...base,
            border: 'none',
            background: 'none',
            boxShadow: 'none',
          }),
          singleValue: (base) => ({
            ...base,
            border: 'none',
            color: 'white',
          }),

          menu: (base) => ({
            ...base,
            border: 'none',
            color: 'white',
            background: '#1f2937',
          }),

          option: (base) => ({
            ...base,
            border: 'none',
            color: 'white',
            background: '#1f2937',
          }),

          container: (base) => ({
            ...base,
            border: 'none',
            color: 'white',
            outline: 'none',
            borderBottom: '2px solid #334155',
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

interface AccountPhoneField {
  className: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
  field: string;
  prevValue: string;
}

export const AccountPhoneField = ({
  label,
  value,
  field,
  className,
  onChange,
  prevValue,
}: AccountPhoneField) => {
  if (!field || !label) {
    throw new Error('field and label are required');
  }

  const { mutate, isLoading, isError } = useAccountFieldMutation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value !== prevValue) {
        // ex. 16045059772
        if (value.length === 11) {
          mutate({
            payload: {
              [field]: value,
            },
          });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value, field]);

  return (
    <PhoneInput
      country={'us'}
      value={value ?? ''}
      onChange={(phone) => onChange(phone)}
      containerClass="py-2 text-gray-300 text-xs"
      inputClass="shadow
      text-base
      appearance-none
      rounded
      w-full
      py-2
      px-3
      leading-tight
      focus:outline-none
      focus:shadow-outline
      bg-transparent
      border-x-0
      border-t-0
      border-b-2
      border-slate-700
      disabled:text-gray-400
      disabled:bg-gray-800
      focus:border-green-200
      active:bg-slate-800
      focus:bg-slate-800
      text-white"
    />
  );
};
