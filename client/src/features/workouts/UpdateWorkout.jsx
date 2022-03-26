import React from "react";

/**
 * A component that contains the logic to update the metadata of a workout
 * PUT /workouts/:workoutId/
 *
 * BODY:
 * {
 *     name: Joi.string().min(3).max(64).optional(),
 *     description: Joi.string().max(250).allow("").optional(),
 *     category: Joi.string().optional(),
 * }
 *
 * Behaviour of this component.
 * 1. Initially the component will prefill form information with the current state of the workout by passing props.
 * 2. Ideally we could have it update whenever the user types / changes one of the inputs. 
 * 3. So whenever onChange is triggered perhaps we send the PUT request to update?
 */
export const UpdateWorkout = ({ workoutId, name, description, category }) => {
  return <div>UpdateWorkout</div>;
};
