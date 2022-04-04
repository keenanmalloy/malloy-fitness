import React from 'react';
import { CgSpinner } from 'react-icons/cg';

export const Input = ({
  onChange,
  value,
  label,
  isRequired,
  isTextArea,
  autoFocus,
  isDisabled,
  isLoading,
}) => {
  if (isTextArea) {
    return (
      <div className="py-2 relative">
        <label>{label}</label>
        <textarea
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required={isRequired}
          value={value}
          onChange={onChange}
          autoFocus={!!autoFocus}
          disabled={isDisabled}
          onBlur={onChange}
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
        type="text"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required={isRequired}
        value={value}
        onChange={onChange}
        autoFocus={!!autoFocus}
        disabled={isDisabled}
        onBlur={onChange}
      />
      {isLoading && (
        <CgSpinner className="w-6 h-6 animate-spin absolute top-6 right-1 text-gray-300" />
      )}
    </div>
  );
};
