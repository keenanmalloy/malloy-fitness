import React from 'react';

export const RadioGroup = ({
  onChange,
  label,
  checked,
  isRequired,
  options,
  name,
}) => {
  return (
    <div>
      <label>{label}</label>
      {options.map((option, key) => {
        return (
          <label htmlFor={option} key={key}>
            <input
              type="radio"
              name={name}
              id={option}
              checked={option === checked}
              required={isRequired}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
};
