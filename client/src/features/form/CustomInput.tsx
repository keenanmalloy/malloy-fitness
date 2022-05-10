import React, { ChangeEventHandler } from 'react';
import { CgSpinner } from 'react-icons/cg';

interface Props {
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  value: string | number;
  label: string;
  isRequired?: boolean;
  autoFocus?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
}

export const CustomInput: React.FC<Props> = ({
  onChange,
  value,
  label,
  isRequired,
  autoFocus,
  isDisabled,
  isLoading,
  placeholder,
  className,
  type = 'text',
}) => {
  return (
    <div className="py-2 relative">
      <label className={`text-gray-300 text-xs`}>{label}</label>
      <input
        type={type}
        className={`
          ${className}
          shadow
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
          text-white
        `}
        required={isRequired}
        value={value}
        onChange={onChange}
        autoFocus={!!autoFocus}
        disabled={isDisabled}
        onBlur={onChange}
        placeholder={placeholder}
      />
      {isLoading && (
        <CgSpinner className="w-6 h-6 animate-spin absolute top-7 right-1 text-green-200" />
      )}
    </div>
  );
};
