import React from 'react';

/**
 * DESTRUCTURE THE FOLLOWING PROPS
 * onChange={*function*}
 * value={*text*}
 * label={*text*}
 * isRequired={*boolean*}
 * isTextArea={*boolean*}
 * {onChange, value, label, isRequired, isTextArea}
 */

export const Input = ({ onChange, value, label, isRequired, isTextArea }) => {
  /**
   * If isTextArea is true, return textarea JSX
   * otherwise return a regular input. Remember to use the isRequired boolean to
   * set the required attribute on both <textarea /> and <input />.
   *
   * ex.
   * if (isTextArea) {
   *    return ...
   * }
   *
   *
   */

  if (isTextArea) {
    return (
      <div>
        <label>{label}</label>
        <textarea
          type="text"
          required={isRequired}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        required={isRequired}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
