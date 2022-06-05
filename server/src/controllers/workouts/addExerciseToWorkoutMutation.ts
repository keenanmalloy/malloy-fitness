import { db } from 'config/db';
import Joi from 'joi';
import { Response } from 'express';
import { createWorkoutTaskWithExercises } from 'queries/workoutTasks';

interface addExercise {
  exerciseId: string;
}

const addExerciseSchema = Joi.object({
  exerciseId: Joi.alternatives(Joi.string(), Joi.number()).required(),
});

export const addExerciseToWorkoutMutation = async (
  res: Response,
  data: addExercise,
  workoutId: string
) => {
  const { error, value, warning } = addExerciseSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      exercise: value,
      error: error,
    });
  } else {
    const { exerciseId } = data;

    if (Number.isNaN(parseInt(exerciseId.toString()))) {
      return res.status(422).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Invalid exercise ID',
      });
    }

    try {
      await createWorkoutTaskWithExercises({
        workoutId,
        payload: {
          exercise_id: exerciseId,
        },
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Exercise added successfully',
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
      });
    }
  }
};
