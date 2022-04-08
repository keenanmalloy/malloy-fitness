import React from "react";

/**
 * A component that contains the logic to clone another workout
 * POST /workouts/:workoutId/copy
 *
 * BODY: no body on this request
 *
 * Behaviour of this component.
 * 1. Initially the user will click a button to open a modal
 * 2. In the modal we'll have details on "starting the workout"
 * 3. On a successful clone, lets redirect them to the new workout page: localhost:3000/workouts/:newWorkoutId
 */
export const CloneWorkout = ({ workoutId }) => {
  return <div>CloneWorkout</div>;
};
