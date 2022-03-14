import React from 'react';

/**
 * DESTRUCTURE THE FOLLOWING PROPS
 * onChange={*function*}
 * value={*text*}
 * label={*text*}
 * isRequired={*boolean*}
 * options={*Array of strings*}
 * defaultOption={*text*}
 */

export const Select = ({
  onChange,
  value,
  label,
  isRequired,
  options,
  defaultOption,
}) => {
  /**
   * Remember to use the isRequired boolean to
   * set the required attribute on <select />.
   *
   * Within the jsx, loop over the options within the <select /> to create them dynamically.
   * Use the defaultOption prop to set the default option
   *
   * Use the onChange and value props just as you did on the initial <select /> html element,
   * but instead pass the dynamic props.
   */
  // options.map((option) => {
  //  return option.value
  // })

  return (
    <div>
      <label>{label}</label>
      <select
        value={value}
        onChange={onChange}
        required={isRequired}
      >
      <option value="" disabled hidden>{defaultOption}</option>
      {options.map((option, key) => <option key={key} value={option}>{option}</option>)}
      </select>
    </div>
  );
};
