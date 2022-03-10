import React from "react";

/**
 * onPrimaryChange={*function*} -- how we set them in state
 * onSecondaryChange={*function*} -- how we set them in state
 * primary={*Array of Objects (muscle groups)*} -- state
 * secondary={*Array of Objects (muscle groups)*} -- state
 */

export const SelectMuscleGroups = () => {
  /**
   * PART 1
   *
   * useState to store the muscleGroups fetched from the API.
   * lets call it muscleGroups, setMuscleGroups. These should be an array of Objects,
   * initialized as an empty array OR null.
   *
   * useEffect to fetch all the muscle groups dynamically.
   * once fetched successfully, setMuscleGroups
   *
   *
   * Check for loading state
   * return a loading state
   *
   * Check for error state
   * return an error message if we have issues fetching the data
   *
   * Check for empty state
   * return a message if there is no data
   *
   * Return data by looping over each object in state (muscleGroups.map())
   * lets return a checkbox for each muscleGroup for now.
   *
   * This would be a solid base, but we still need a lot more work on this component.
   *
   *
   * PART 2 coming soon...
   */

  return <div>SelectMuscleGroups</div>;
};
