import { db } from 'config/db';
import { Response } from 'express';

export const removeMuscleGroupFromExercise = async (
  res: Response,
  exerciseId: string,
  muscleGroupId: string,
  group: 'primary' | 'secondary'
) => {
  const query = `DELETE FROM exercise_muscle_groups WHERE exercise_id = $1 AND muscle_group_id = $2 AND "group" = $3 RETURNING *;`;
  const params = [exerciseId, muscleGroupId, group];
  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Muscle-group does not exist',
        muscleGroup: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Muscle-group removed successfully',
      muscleGroup: data.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      muscleGroup: null,
    });
  }
};
