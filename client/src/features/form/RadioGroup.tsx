import React from 'react';

interface Props {
  label: string;
  onChange: (data: any) => void;
  checked: boolean;
  isRequired: boolean;
  options: any[];
  name: string;
}

export const RadioGroup = ({
  onChange,
  label,
  checked,
  isRequired,
  options,
  name,
}: Props) => {
  return (
    <div className="py-2">
      <label>{label}</label>
      <ul className="grid grid-cols-3 mt-2">
        {options.map((option, key) => {
          return (
            <li key={key} className="relative flex align-center">
              <input
                className="sr-only peer"
                type="radio"
                value={option}
                name={name}
                id={option}
                checked={option === checked}
                required={isRequired}
                onChange={() => onChange(option)}
              />
              <label
                className="flex justify-center mx-1 px-5 py-3 w-full bg-white rounded-md cursor-pointer hover:bg-gray-50 peer-checked:ring-blue-500 peer-checked:ring-2 peer-checked:bg-white"
                htmlFor={option}
              >
                {option}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
