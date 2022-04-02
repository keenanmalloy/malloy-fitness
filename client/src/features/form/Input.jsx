import React from 'react';

export const Input = ({
  onChange,
  value,
  label,
  isRequired,
  isTextArea,
  autoFocus,
}) => {
  if (isTextArea) {
    return (
      <div className="py-2">
        <label>{label}</label>
        <textarea
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required={isRequired}
          value={value}
          onChange={onChange}
          autoFocus={!!autoFocus}
        />
      </div>
    );
  }

  return (
    <div className="py-2">
      <label>{label}</label>
      <input
        type="text"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required={isRequired}
        value={value}
        onChange={onChange}
        autoFocus={!!autoFocus}
      />
    </div>
  );
};
