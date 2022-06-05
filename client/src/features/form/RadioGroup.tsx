import React from 'react';

interface Props {
  label: string;
  onChange: (data: any) => void;
  checked: string;
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
    <div className="py-2 ">
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
                className="text-white flex justify-center mx-1 px-5 py-3 w-full bg-slate-800 rounded-md cursor-pointer  peer-checked:ring-green-400 peer-checked:ring-2 peer-checked:bg-slate-700"
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
