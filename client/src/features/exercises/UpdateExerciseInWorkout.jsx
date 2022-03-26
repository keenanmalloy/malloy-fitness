import React from "react";

/**
 * A component that contains the logic to update the order or priority of an exercise from within a workout.
 * PUT /workouts/:workoutId/exercises/:exerciseId
 * 
 * Behaviour of this component. 
 * 1. Initially the majority of the component should be hidden (ex. a small button on the side of the exercise with no text)
 * 2. Once the button is clicked, the main component shows on the exercise with Order and Priority number inputs
 * that the user can increment by clicking on buttons OR by typing within an input.
 * 3. Each time an intent to change order or priority is clicked, we should refetch the entire workout, or change the state of the exercises.
 */
export const UpdateExerciseInWorkout = ({ workoutId, exerciseId }) => {
  return <div>UpdateExerciseInWorkout</div>;
};
