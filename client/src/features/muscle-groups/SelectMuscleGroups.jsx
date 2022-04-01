import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export const SelectMuscleGroups = ({
  setData,
  label,
  onChange,
  value,
  isRequired,
  options,
  defaultValue,
  muscleGroups,
}) => {
  // const [muscleGroups, setMuscleGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div>
      <label>{label}</label>
      {/* <select onChange={onChange} required={isRequired}>
        <option disabled hidden>
          {defaultOption}
        </option>
      </select> */}
      <Select
        id="long-value-select"
        instanceId="long-value-select"
        defaultValue={defaultValue}
        isMulti
        onChange={(data) => setData(data)}
        name="muscleGroups"
        options={muscleGroups.map((muscleGroup) => {
          return {
            label: muscleGroup.name,
            value: muscleGroup.muscle_group_id,
          };
        })}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </div>
  );
};
