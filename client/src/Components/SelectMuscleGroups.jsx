import React, { useState, useEffect } from 'react';

/**
 * onPrimaryChange={*function*} -- how we set them in state
 * onSecondaryChange={*function*} -- how we set them in state
 * primary={*Array of Objects (muscle groups)*} -- state
 * secondary={*Array of Objects (muscle groups)*} -- state
 */

export const SelectMuscleGroups = ({
  onPrimaryChange,
  onSecondaryChange,
  primary,
  secondary,
  label,
}) => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/muscle-groups')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMuscleGroups(data.muscleGroups);
        setIsLoading(false);
      })
      .catch((error) => {
        return setError(true);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  /**
   * PART 1
   *
   * Return data by looping over each object in state (muscleGroups.map())
   * lets return a checkbox for each muscleGroup for now.
   *
   * This would be a solid base, but we still need a lot more work on this component.
   *
   *
   * PART 2 coming soon...
   */

  return (
    <div>
      <label>{label}</label>
      {muscleGroups.map((muscleGroup, key) => {
        return (
          <div key={key}>
            <input type="checkbox" />
          </div>
        );
      })}
    </div>
  );
};
