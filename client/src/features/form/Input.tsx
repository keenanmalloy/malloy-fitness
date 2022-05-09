import React, { ChangeEventHandler } from 'react';
import { CgSpinner } from 'react-icons/cg';

interface Props {
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  value: string | number;
  label: string;
  isRequired?: boolean;
  isTextArea?: boolean;
  autoFocus?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  type?: string;
}

export const Input: React.FC<Props> = ({
  onChange,
  value,
  label,
  isRequired,
  isTextArea,
  autoFocus,
  isDisabled,
  isLoading,
  placeholder,
  type = 'text',
}) => {
  if (isTextArea) {
    return (
      <div className="py-2 relative">
        <label>{label}</label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required={isRequired}
          value={value}
          onChange={onChange}
          autoFocus={!!autoFocus}
          disabled={isDisabled}
          onBlur={onChange}
          placeholder={placeholder}
          style={{
            minHeight: '100px',
          }}
        />
        {isLoading && (
          <CgSpinner className="w-6 h-6 animate-spin absolute top-6 right-1 text-gray-300" />
        )}
      </div>
    );
  }

  return (
    <div className="py-2 relative">
      <label>{label}</label>
      <input
        type={type}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required={isRequired}
        value={value}
        onChange={onChange}
        autoFocus={!!autoFocus}
        disabled={isDisabled}
        onBlur={onChange}
        placeholder={placeholder}
      />
      {isLoading && (
        <CgSpinner className="w-6 h-6 animate-spin absolute top-4 right-1 text-blue-50" />
      )}
    </div>
  );
};
