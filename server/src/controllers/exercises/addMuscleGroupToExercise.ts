import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';

interface addMuscleGroup {
  group: 'primary' | 'secondary';
  muscleGroupId: number | string;
}

const addMuscleGroupSchema = Joi.object({
  group: Joi.string().valid('primary', 'secondary'),
  muscleGroupId: Joi.alternatives(Joi.string(), Joi.number()).required(),
});

export const addMuscleGroupToExercise = async (
  res: Response,
  data: addMuscleGroup,
  exerciseId: string
) => {
  const { error, value, warning } = addMuscleGroupSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      muscleGroup: value,
      error: error,
    });
  } else {
    const { muscleGroupId, group } = data;

    if (Number.isNaN(parseInt(muscleGroupId.toString()))) {
      return res.status(422).json({
        role: res.locals.state.account.role,
        status: 'error',
        //@ts-ignore
        message: 'Invalid muscleGroup ID',
      });
    }

    const query = `
    WITH
    data(exercise_id, muscle_group_id, "group") AS (
      VALUES
          (${exerciseId}, ${muscleGroupId}, '${group}')
      )
    INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, "group")
      SELECT exercise_id, muscle_group_id, "group"
        FROM data
      RETURNING *
      `;

    try {
      const data = await db.query(query);
      const muscleGroup = data.rows[0];

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Muscle-group added successfully',
        muscleGroup,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
        muscleGroup: null,
      });
    }
  }
};
